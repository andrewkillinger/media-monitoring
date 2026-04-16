-- Newsletter subsections

create table subsections (
    id             uuid primary key default gen_random_uuid(),
    section_id     uuid not null references sections(id) on delete cascade,
    name           text not null,
    slug           text not null,
    display_order  integer not null default 0,
    is_active      boolean not null default true,
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now(),
    unique (section_id, slug)
);
