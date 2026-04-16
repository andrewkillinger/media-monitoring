import type { EntityMatch, EntityWithAliases } from "../types";
import { escapeRegex } from "../../utils/text";

// Re-export for convenience
export type { EntityWithAliases };

// ─── Compiled entry in the index ─────────────────────────────────────────────

interface IndexEntry {
  entity: EntityWithAliases;
  alias: string;
  pattern: RegExp;
}

export interface FindMatchesInput {
  title: string;
  bodyText: string | null;
}

/**
 * EntityIndex builds compiled regex patterns from entity aliases and provides
 * fast multi-entity matching across article text.
 *
 * Alias variants that are handled:
 *   - Exact alias text (case-insensitive, whole-word boundary)
 *   - Common typo variants for known pharma terms (e.g. "Aduhlem" for "Aduhelm")
 *   - Hyphenation variants (ANAVEX-27-3 vs ANAVEX 27 3)
 *
 * Whole-word matching is used by default to prevent partial matches
 * (e.g. "Act" not matching inside "Acadia").
 */
export class EntityIndex {
  private readonly entries: IndexEntry[] = [];

  constructor(entities: EntityWithAliases[]) {
    for (const entity of entities) {
      if (entity.is_active === false) continue;

      const allAliases = new Set<string>();

      // Add entity name itself
      allAliases.add(entity.name);

      // Add all explicit aliases
      for (const alias of entity.aliases) {
        if (alias.alias_text.trim()) {
          allAliases.add(alias.alias_text.trim());
        }
      }

      // Expand each alias with additional variants
      const withVariants = new Set<string>(allAliases);
      for (const alias of allAliases) {
        for (const variant of generateVariants(alias)) {
          withVariants.add(variant);
        }
      }

      for (const alias of withVariants) {
        if (!alias) continue;
        try {
          const pattern = buildEntityPattern(alias);
          this.entries.push({ entity, alias, pattern });
        } catch {
          // Skip aliases that produce invalid regex
        }
      }
    }
  }

  /**
   * Find all entity matches in the given title and body texts.
   * Accepts either (title: string, body: string | null) or
   * a single { title, bodyText } object for compatibility with tests.
   *
   * Returns one EntityMatch per entity (merged across title/body).
   */
  findMatches(
    titleOrInput: string | FindMatchesInput,
    body?: string | null
  ): EntityMatch[] {
    let title: string;
    let bodyText: string | null;

    if (typeof titleOrInput === "string") {
      title = titleOrInput;
      bodyText = body ?? null;
    } else {
      title = titleOrInput.title;
      bodyText = titleOrInput.bodyText ?? null;
    }

    const matchMap = new Map<string, EntityMatch>();

    const titleLower = title.toLowerCase();
    const bodyLower = (bodyText ?? "").toLowerCase();

    for (const entry of this.entries) {
      const inTitle = entry.pattern.test(titleLower);
      const inBody = bodyLower ? entry.pattern.test(bodyLower) : false;

      if (!inTitle && !inBody) continue;

      const location: EntityMatch["matchLocation"] =
        inTitle && inBody ? "both" : inTitle ? "title" : "body";

      const existing = matchMap.get(entry.entity.id);

      if (!existing) {
        matchMap.set(entry.entity.id, {
          entityId: entry.entity.id,
          entityName: entry.entity.name,
          matchedAlias: entry.alias,
          matchLocation: location,
          isCompetitor: entry.entity.is_competitor,
          products: entry.entity.products ?? [],
          diseaseStates: entry.entity.diseaseStates ?? entry.entity.disease_states ?? [],
        });
      } else {
        // Upgrade match location if we find it in more places
        if (existing.matchLocation !== "both" && existing.matchLocation !== location) {
          existing.matchLocation = "both";
        }
        // Prefer the primary alias name
        const existingAlias = entry.entity.aliases.find(
          (a) => a.alias_text === existing.matchedAlias
        );
        const newAlias = entry.entity.aliases.find(
          (a) => a.alias_text === entry.alias
        );
        if (!existingAlias?.is_primary && newAlias?.is_primary) {
          existing.matchedAlias = entry.alias;
        }
      }
    }

    return Array.from(matchMap.values());
  }

  /**
   * Quickly test if any tracked entity appears in the text.
   */
  hasAnyMatch(text: string): boolean {
    const lower = text.toLowerCase();
    return this.entries.some((e) => e.pattern.test(lower));
  }

  get entityCount(): number {
    return new Set(this.entries.map((e) => e.entity.id)).size;
  }
}

// ─── Pattern building ─────────────────────────────────────────────────────────

/**
 * Build a whole-word regex for an entity alias.
 * Shorter aliases (< 4 chars) get stricter boundaries.
 */
function buildEntityPattern(alias: string): RegExp {
  const escaped = escapeRegex(alias.toLowerCase());

  // For very short terms, require strict word boundaries
  if (alias.length < 4) {
    return new RegExp(`\\b${escaped}\\b`, "i");
  }

  // For longer terms, use lookahead/lookbehind to handle punctuation around them
  return new RegExp(
    `(?<![a-z0-9])${escaped}(?![a-z0-9])`,
    "i"
  );
}

/**
 * Generate common variants for a given alias string.
 * Handles pharma-specific patterns like:
 *   - Hyphen ↔ space (ANAVEX-27-3 → ANAVEX 27 3)
 *   - Common known typos hardcoded below
 */
function generateVariants(alias: string): string[] {
  const variants: string[] = [];

  // Hyphen ↔ space variant
  if (alias.includes("-")) {
    variants.push(alias.replace(/-/g, " "));
  }
  if (alias.includes(" ")) {
    variants.push(alias.replace(/ /g, "-"));
  }

  // Known pharma typo mappings
  const typoMap: Record<string, string[]> = {
    Aduhelm: ["Aduhlem", "aduhelm"],
    aducanumab: ["adacanumab", "aducanumab-avwa"],
    NUPLAZID: ["Nuplazid", "nuplazid"],
    pimavanserin: ["pimavanserine"],
    lecanemab: ["lecanamab", "lecanemab-irmb"],
    donanemab: ["donanumab"],
    "Alzheimer's": ["Alzheimers", "Alzheimer disease"],
    Parkinson: ["Parkinsons", "Parkinson's disease"],
    Minerva: ["Minvera"],
  };

  for (const [canonical, typos] of Object.entries(typoMap)) {
    if (alias.toLowerCase() === canonical.toLowerCase()) {
      variants.push(...typos);
    }
  }

  return variants;
}

// ─── Standalone helper ────────────────────────────────────────────────────────

/**
 * Simple utility to check if a text contains an entity alias with word
 * boundary safety. Useful for quick single-entity checks.
 */
export function textContainsAlias(text: string, alias: string): boolean {
  try {
    const pattern = buildEntityPattern(alias);
    return pattern.test(text);
  } catch {
    return text.toLowerCase().includes(alias.toLowerCase());
  }
}
