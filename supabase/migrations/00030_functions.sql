-- Helper functions and updated_at triggers

-- 1. auth_user_role(): returns the user_role for the currently authenticated user
create or replace function auth_user_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
    select role
    from profiles
    where id = auth.uid();
$$;

-- 2. update_updated_at(): generic trigger function to stamp updated_at on any row change
create or replace function update_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- 3. Apply updated_at trigger to all tables that carry the column

create trigger trg_profiles_updated_at
    before update on profiles
    for each row execute function update_updated_at();

create trigger trg_disease_states_updated_at
    before update on disease_states
    for each row execute function update_updated_at();

create trigger trg_entities_updated_at
    before update on entities
    for each row execute function update_updated_at();

create trigger trg_sections_updated_at
    before update on sections
    for each row execute function update_updated_at();

create trigger trg_subsections_updated_at
    before update on subsections
    for each row execute function update_updated_at();

create trigger trg_outlets_updated_at
    before update on outlets
    for each row execute function update_updated_at();

create trigger trg_source_adapters_updated_at
    before update on source_adapters
    for each row execute function update_updated_at();

create trigger trg_articles_updated_at
    before update on articles
    for each row execute function update_updated_at();

create trigger trg_story_clusters_updated_at
    before update on story_clusters
    for each row execute function update_updated_at();

create trigger trg_rules_updated_at
    before update on rules
    for each row execute function update_updated_at();

create trigger trg_item_flags_updated_at
    before update on item_flags
    for each row execute function update_updated_at();

create trigger trg_schedules_updated_at
    before update on schedules
    for each row execute function update_updated_at();

create trigger trg_digest_runs_updated_at
    before update on digest_runs
    for each row execute function update_updated_at();
