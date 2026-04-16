-- Newsletter / alert delivery schedules

create table schedules (
    id                       uuid primary key default gen_random_uuid(),
    name                     text not null,
    schedule_type            text not null check (schedule_type in (
                                 'daily_newsletter',
                                 'milestone_eod',
                                 'milestone_morning',
                                 'ad_hoc',
                                 'quarterly',
                                 'annual'
                             )),
    cron_expression          text,
    timezone                 text not null default 'America/Los_Angeles',
    coverage_cutoff_minutes  integer,
    is_active                boolean not null default true,
    config                   jsonb not null default '{}',
    last_run_at              timestamptz,
    next_run_at              timestamptz,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);
