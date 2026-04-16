-- Secure file / full-text attachments (references Supabase Storage)

create table attachments (
    id               uuid primary key default gen_random_uuid(),
    article_id       uuid not null references articles(id) on delete cascade,
    file_name        text not null,
    file_type        text,
    storage_path     text not null,
    file_size_bytes  bigint,
    uploaded_by      uuid references profiles(id) on delete set null,
    is_full_text     boolean not null default false,
    created_at       timestamptz not null default now()
);
