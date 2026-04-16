-- Disease states / therapeutic areas

create table disease_states (
    id             uuid primary key default gen_random_uuid(),
    name           text not null unique,
    slug           text not null unique,
    description    text,
    is_active      boolean not null default true,
    display_order  integer not null default 0,
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now()
);
