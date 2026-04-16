-- Rule actions

create table rule_actions (
    id           uuid primary key default gen_random_uuid(),
    rule_id      uuid not null references rules(id) on delete cascade,
    action_type  action_type not null,
    target_id    uuid,
    target_value text,
    metadata     jsonb not null default '{}',
    created_at   timestamptz not null default now()
);
