/**
 * Supabase-compatible chainable query builder over pg.Pool.
 *
 * Implements the subset of the Supabase PostgREST query API that is used
 * by the media monitoring pipeline (ingest.ts, classify.ts, builder.ts).
 *
 * Supported chain patterns:
 *   db.from("t").select("*").eq("col", v).gte("col", v).order("col").limit(n)
 *   db.from("t").insert(row).select("id").single()
 *   db.from("t").update(data).eq("col", v)
 *   db.from("t").delete().eq("col", v)
 */

import type { Pool } from "pg";

// ─── Public types ────────────────────────────────────────────────────────────

export interface QueryResult<T = Record<string, unknown>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  error: { message: string; code?: string } | null;
}

type WhereClause = {
  type: "eq" | "gte" | "lte";
  column: string;
  value: unknown;
};

type InClause = {
  type: "in";
  column: string;
  values: unknown[];
};

type Filter = WhereClause | InClause;

// ─── Query builder ───────────────────────────────────────────────────────────

export class QueryBuilder {
  private pool: Pool;
  private table: string;
  private operation: "select" | "insert" | "update" | "delete" = "select";
  private selectColumns = "*";
  private filters: Filter[] = [];
  private orderClauses: { column: string; ascending: boolean }[] = [];
  private limitCount: number | null = null;
  private isSingle = false;
  private insertData: Record<string, unknown> | Record<string, unknown>[] | null = null;
  private updateData: Record<string, unknown> | null = null;
  private returningColumns: string | null = null;

  constructor(pool: Pool, table: string) {
    this.pool = pool;
    this.table = table;
  }

  // ─── Operation starters ──────────────────────────────────────────────

  select(columns?: string): this {
    if (this.operation === "insert") {
      // Called after .insert() → means RETURNING
      this.returningColumns = columns || "*";
      return this;
    }
    this.operation = "select";
    this.selectColumns = columns || "*";
    return this;
  }

  insert(
    data: Record<string, unknown> | Record<string, unknown>[]
  ): this {
    this.operation = "insert";
    this.insertData = data;
    return this;
  }

  update(data: Record<string, unknown>): this {
    this.operation = "update";
    this.updateData = data;
    return this;
  }

  delete(): this {
    this.operation = "delete";
    return this;
  }

  // ─── Filters ─────────────────────────────────────────────────────────

  eq(column: string, value: unknown): this {
    this.filters.push({ type: "eq", column, value });
    return this;
  }

  in(column: string, values: unknown[]): this {
    this.filters.push({ type: "in", column, values });
    return this;
  }

  gte(column: string, value: unknown): this {
    this.filters.push({ type: "gte", column, value });
    return this;
  }

  lte(column: string, value: unknown): this {
    this.filters.push({ type: "lte", column, value });
    return this;
  }

  // ─── Modifiers ───────────────────────────────────────────────────────

  order(column: string, opts?: { ascending?: boolean }): this {
    this.orderClauses.push({ column, ascending: opts?.ascending ?? true });
    return this;
  }

  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  single(): this {
    this.isSingle = true;
    this.limitCount = 1;
    return this;
  }

  // ─── Execution (thenable) ────────────────────────────────────────────

  then<TResult1 = QueryResult, TResult2 = never>(
    onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(): Promise<QueryResult> {
    try {
      switch (this.operation) {
        case "select":
          return await this.executeSelect();
        case "insert":
          return await this.executeInsert();
        case "update":
          return await this.executeUpdate();
        case "delete":
          return await this.executeDelete();
        default:
          return { data: null, error: { message: `Unknown operation: ${this.operation}` } };
      }
    } catch (err: unknown) {
      const pgErr = err as { message?: string; code?: string };
      return {
        data: null,
        error: {
          message: pgErr.message ?? String(err),
          code: pgErr.code,
        },
      };
    }
  }

  // ─── SELECT ──────────────────────────────────────────────────────────

  private async executeSelect(): Promise<QueryResult> {
    const params: unknown[] = [];
    let sql = `SELECT ${this.selectColumns} FROM "${this.table}"`;

    const where = this.buildWhere(params);
    if (where) sql += ` WHERE ${where}`;

    if (this.orderClauses.length > 0) {
      const parts = this.orderClauses.map(
        (o) => `"${o.column}" ${o.ascending ? "ASC" : "DESC"}`
      );
      sql += ` ORDER BY ${parts.join(", ")}`;
    }

    if (this.limitCount !== null) {
      sql += ` LIMIT ${this.limitCount}`;
    }

    const result = await this.pool.query(sql, params);

    if (this.isSingle) {
      return { data: result.rows[0] ?? null, error: null };
    }
    return { data: result.rows, error: null };
  }

  // ─── INSERT ──────────────────────────────────────────────────────────

  private async executeInsert(): Promise<QueryResult> {
    if (!this.insertData) {
      return { data: null, error: { message: "No data to insert" } };
    }

    const rows = Array.isArray(this.insertData)
      ? this.insertData
      : [this.insertData];

    if (rows.length === 0) {
      return { data: [], error: null };
    }

    // Use keys from first row as columns
    const columns = Object.keys(rows[0]);
    const params: unknown[] = [];
    const valueSets: string[] = [];

    for (const row of rows) {
      const placeholders: string[] = [];
      for (const col of columns) {
        params.push(row[col] ?? null);
        placeholders.push(`$${params.length}`);
      }
      valueSets.push(`(${placeholders.join(", ")})`);
    }

    const quotedCols = columns.map((c) => `"${c}"`).join(", ");
    let sql = `INSERT INTO "${this.table}" (${quotedCols}) VALUES ${valueSets.join(", ")}`;

    if (this.returningColumns) {
      sql += ` RETURNING ${this.returningColumns}`;
    }

    const result = await this.pool.query(sql, params);

    if (this.returningColumns) {
      if (this.isSingle) {
        return { data: result.rows[0] ?? null, error: null };
      }
      return { data: result.rows, error: null };
    }

    return { data: null, error: null };
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────

  private async executeUpdate(): Promise<QueryResult> {
    if (!this.updateData) {
      return { data: null, error: { message: "No data to update" } };
    }

    const params: unknown[] = [];
    const setClauses: string[] = [];

    for (const [key, value] of Object.entries(this.updateData)) {
      params.push(value ?? null);
      setClauses.push(`"${key}" = $${params.length}`);
    }

    let sql = `UPDATE "${this.table}" SET ${setClauses.join(", ")}`;

    const where = this.buildWhere(params);
    if (where) sql += ` WHERE ${where}`;

    await this.pool.query(sql, params);
    return { data: null, error: null };
  }

  // ─── DELETE ──────────────────────────────────────────────────────────

  private async executeDelete(): Promise<QueryResult> {
    const params: unknown[] = [];
    let sql = `DELETE FROM "${this.table}"`;

    const where = this.buildWhere(params);
    if (where) sql += ` WHERE ${where}`;

    await this.pool.query(sql, params);
    return { data: null, error: null };
  }

  // ─── WHERE builder ───────────────────────────────────────────────────

  private buildWhere(params: unknown[]): string {
    if (this.filters.length === 0) return "";

    const clauses: string[] = [];

    for (const filter of this.filters) {
      switch (filter.type) {
        case "eq":
          params.push(filter.value);
          clauses.push(`"${filter.column}" = $${params.length}`);
          break;

        case "gte":
          params.push(filter.value);
          clauses.push(`"${filter.column}" >= $${params.length}`);
          break;

        case "lte":
          params.push(filter.value);
          clauses.push(`"${filter.column}" <= $${params.length}`);
          break;

        case "in": {
          if (filter.values.length === 0) {
            // Empty IN → always false
            clauses.push("FALSE");
          } else {
            const placeholders = filter.values.map((v) => {
              params.push(v);
              return `$${params.length}`;
            });
            clauses.push(
              `"${filter.column}" IN (${placeholders.join(", ")})`
            );
          }
          break;
        }
      }
    }

    return clauses.join(" AND ");
  }
}
