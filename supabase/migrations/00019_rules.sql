-- Classification / routing rules

create table rules (
    id          uuid primary key default gen_random_uuid(),
    name        text not null,
    description text,
    priority    integer not null default 100,
    is_active   boolean not null default true,
    rule_type   rule_type not null,
    match_mode  match_mode not null default 'all',
    created_by  uuid references profiles(id) on delete set null,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

-- Now that rules exists, add FK on article_sections.assigned_by_rule_id
alter table article_sections
    add constraint article_sections_assigned_by_rule_id_fkey
    foreign key (assigned_by_rule_id) references rules(id) on delete set null;
