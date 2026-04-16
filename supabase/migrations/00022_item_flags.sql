-- Flags and alerts on articles

create table item_flags (
    id                   uuid primary key default gen_random_uuid(),
    article_id           uuid not null references articles(id) on delete cascade,
    flag_type            text not null check (flag_type in (
                             'acadia_earned',
                             'acadia_data',
                             'acadia_personnel',
                             'catch_correct',
                             'issues_related',
                             'competitor_milestone',
                             'negative_product',
                             'drug_pricing',
                             'litigation',
                             'regulatory',
                             'ma_update',
                             'custom'
                         )),
    severity             alert_severity not null default 'medium',
    status               alert_status not null default 'new',
    title                text,
    notes                text,
    created_by           uuid references profiles(id) on delete set null,
    resolved_by          uuid references profiles(id) on delete set null,
    resolved_at          timestamptz,
    hold_from_newsletter boolean not null default false,
    created_at           timestamptz not null default now(),
    updated_at           timestamptz not null default now()
);
