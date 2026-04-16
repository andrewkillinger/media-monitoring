-- Source adapter configurations

create table source_adapters (
    id                      uuid primary key default gen_random_uuid(),
    name                    text not null,
    adapter_type            source_type not null,
    settings                jsonb not null default '{}',
    credentials_encrypted   jsonb,
    is_active               boolean not null default true,
    fetch_interval_minutes  integer not null default 60,
    last_fetched_at         timestamptz,
    last_cursor             text,
    created_at              timestamptz not null default now(),
    updated_at              timestamptz not null default now()
);
