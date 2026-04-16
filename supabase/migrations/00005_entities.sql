-- Entities: companies, organizations, products, molecules, people

create table entities (
    id               uuid primary key default gen_random_uuid(),
    name             text not null,
    slug             text not null unique,
    entity_type      text not null check (entity_type in ('company', 'organization', 'product', 'molecule', 'person')),
    is_primary       boolean not null default false,
    is_competitor    boolean not null default false,
    parent_entity_id uuid references entities(id) on delete set null,
    metadata         jsonb not null default '{}',
    is_active        boolean not null default true,
    created_at       timestamptz not null default now(),
    updated_at       timestamptz not null default now()
);
