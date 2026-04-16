-- Manual overrides audit trail

create table item_overrides (
    id              uuid primary key default gen_random_uuid(),
    article_id      uuid not null references articles(id) on delete cascade,
    override_type   text check (override_type in (
                        'include',
                        'exclude',
                        'reclassify',
                        'update_section',
                        'update_priority',
                        'correct'
                    )),
    previous_value  jsonb,
    new_value       jsonb,
    reason          text,
    created_by      uuid not null references profiles(id) on delete restrict,
    created_at      timestamptz not null default now()
);
