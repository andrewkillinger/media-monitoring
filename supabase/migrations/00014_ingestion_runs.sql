-- Ingestion run tracking

create table ingestion_runs (
    id                 uuid primary key default gen_random_uuid(),
    source_adapter_id  uuid references source_adapters(id) on delete set null,
    started_at         timestamptz not null default now(),
    completed_at       timestamptz,
    status             text not null default 'running' check (status in ('running', 'completed', 'failed')),
    items_fetched      integer not null default 0,
    items_new          integer not null default 0,
    items_duplicate    integer not null default 0,
    items_error        integer not null default 0,
    error_message      text,
    metadata           jsonb not null default '{}'
);
