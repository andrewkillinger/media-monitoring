-- Newsletter sections

create table sections (
    id             uuid primary key default gen_random_uuid(),
    name           text not null,
    slug           text not null unique,
    description    text,
    display_order  integer not null default 0,
    is_active      boolean not null default true,
    is_default     boolean not null default false,
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now()
);
