-- M2M: digest_runs <-> articles (ordered display list)

create table digest_items (
    id               uuid primary key default gen_random_uuid(),
    digest_run_id    uuid not null references digest_runs(id) on delete cascade,
    article_id       uuid not null references articles(id) on delete cascade,
    section_id       uuid not null references sections(id) on delete cascade,
    subsection_id    uuid references subsections(id) on delete set null,
    display_order    integer not null default 0,
    display_headline text,
    display_outlet   text,
    created_at       timestamptz not null default now()
);
