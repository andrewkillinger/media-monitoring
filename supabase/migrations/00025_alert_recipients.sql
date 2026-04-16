-- Alert / digest email recipients

create table alert_recipients (
    id           uuid primary key default gen_random_uuid(),
    schedule_id  uuid references schedules(id) on delete set null,
    email        text not null,
    name         text,
    is_active    boolean not null default true,
    alert_types  text[],
    created_at   timestamptz not null default now()
);
