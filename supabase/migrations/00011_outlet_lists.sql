-- Named outlet groupings (e.g. "Canada Priority", "French-language Canada", "Academic Journals Exclude")

create table outlet_lists (
    id          uuid primary key default gen_random_uuid(),
    name        text not null unique,
    slug        text not null unique,
    description text,
    list_type   text check (list_type in ('priority', 'exclude', 'monitor')),
    created_at  timestamptz not null default now()
);
