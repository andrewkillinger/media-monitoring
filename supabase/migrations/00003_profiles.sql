-- User profiles (standalone, no Supabase auth dependency)

create table profiles (
    id          uuid primary key default gen_random_uuid(),
    email       text not null,
    full_name   text,
    role        user_role not null default 'reviewer',
    is_active   boolean not null default true,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);
