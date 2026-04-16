-- Media outlets

create table outlets (
    id           uuid primary key default gen_random_uuid(),
    name         text not null,
    slug         text not null unique,
    tier         outlet_tier not null default 'other',
    channel      channel_type not null default 'online',
    url          text,
    region       text,
    country      text,
    language     text not null default 'en',
    is_priority  boolean not null default false,
    is_excluded  boolean not null default false,
    metadata     jsonb not null default '{}',
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);
