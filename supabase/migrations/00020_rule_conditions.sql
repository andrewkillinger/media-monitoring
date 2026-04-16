-- Rule conditions

create table rule_conditions (
    id          uuid primary key default gen_random_uuid(),
    rule_id     uuid not null references rules(id) on delete cascade,
    field       condition_field not null,
    operator    condition_operator not null,
    value       text not null,
    is_negated  boolean not null default false,
    group_id    integer not null default 0,
    group_mode  match_mode not null default 'all',
    created_at  timestamptz not null default now()
);
