-- M2M: articles <-> entities

create table article_entities (
    id                  uuid primary key default gen_random_uuid(),
    article_id          uuid not null references articles(id) on delete cascade,
    entity_id           uuid not null references entities(id) on delete cascade,
    matched_alias       text,
    match_location      text check (match_location in ('title', 'body', 'both')),
    is_primary_mention  boolean not null default false,
    created_at          timestamptz not null default now()
);
