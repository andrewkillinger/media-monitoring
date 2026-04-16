-- Immutable audit log

create table audit_log (
    id             uuid primary key default gen_random_uuid(),
    user_id        uuid references profiles(id) on delete set null,
    action         text not null,
    resource_type  text not null,
    resource_id    uuid,
    old_value      jsonb,
    new_value      jsonb,
    metadata       jsonb not null default '{}',
    ip_address     text,
    created_at     timestamptz not null default now()
);
