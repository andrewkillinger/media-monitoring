-- Entity aliases / alternate names

create table entity_aliases (
    id           uuid primary key default gen_random_uuid(),
    entity_id    uuid not null references entities(id) on delete cascade,
    alias_text   text not null,
    is_primary   boolean not null default false,
    created_at   timestamptz not null default now(),
    unique (entity_id, alias_text)
);
