-- M2M: articles <-> sections (with optional subsection)

create table article_sections (
    id                   uuid primary key default gen_random_uuid(),
    article_id           uuid not null references articles(id) on delete cascade,
    section_id           uuid not null references sections(id) on delete cascade,
    subsection_id        uuid references subsections(id) on delete set null,
    assigned_by_rule_id  uuid,
    is_manual_override   boolean not null default false,
    created_at           timestamptz not null default now()
);
