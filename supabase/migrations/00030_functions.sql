-- Helper functions and updated_at triggers

-- 1. auth_user_role(): returns admin for all users (no auth, full access)
create or replace function auth_user_role()
returns user_role
language sql
stable
as $$
    select 'admin'::user_role;
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
