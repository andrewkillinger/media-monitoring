-- Digest / newsletter generation runs

create table digest_runs (
    id                  uuid primary key default gen_random_uuid(),
    schedule_id         uuid references schedules(id) on delete set null,
    digest_date         date not null,
    status              digest_status not null default 'draft',
    coverage_start      timestamptz,
    coverage_end        timestamptz,
    overview_text       text,
    generated_html      text,
    generated_markdown  text,
    generated_by        uuid references profiles(id) on delete set null,
    reviewed_by         uuid references profiles(id) on delete set null,
    sent_at             timestamptz,
    created_at          timestamptz not null default now(),
    updated_at          timestamptz not null default now()
);
