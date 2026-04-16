-- Row Level Security policies for all tables

-- ============================================================
-- Enable RLS on all tables
-- ============================================================

alter table profiles               enable row level security;
alter table disease_states         enable row level security;
alter table entities               enable row level security;
alter table entity_aliases         enable row level security;
alter table entity_disease_states  enable row level security;
alter table sections               enable row level security;
alter table subsections            enable row level security;
alter table outlets                enable row level security;
alter table outlet_lists           enable row level security;
alter table outlet_list_members    enable row level security;
alter table source_adapters        enable row level security;
alter table ingestion_runs         enable row level security;
alter table articles               enable row level security;
alter table story_clusters         enable row level security;
alter table article_entities       enable row level security;
alter table article_sections       enable row level security;
alter table rules                  enable row level security;
alter table rule_conditions        enable row level security;
alter table rule_actions           enable row level security;
alter table item_flags             enable row level security;
alter table item_overrides         enable row level security;
alter table schedules              enable row level security;
alter table alert_recipients       enable row level security;
alter table digest_runs            enable row level security;
alter table digest_items           enable row level security;
alter table attachments            enable row level security;
alter table audit_log              enable row level security;

-- ============================================================
-- profiles
-- ============================================================

-- Any authenticated user can read all profiles
create policy "profiles: authenticated read all"
    on profiles for select
    to authenticated
    using (true);

-- Users can update only their own profile
create policy "profiles: update own"
    on profiles for update
    to authenticated
    using (id = auth.uid())
    with check (id = auth.uid());

-- ============================================================
-- articles
-- ============================================================

create policy "articles: authenticated read"
    on articles for select
    to authenticated
    using (true);

create policy "articles: editor/admin insert"
    on articles for insert
    to authenticated
    with check (auth_user_role() in ('editor', 'admin'));

create policy "articles: editor/admin update"
    on articles for update
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));

create policy "articles: admin delete"
    on articles for delete
    to authenticated
    using (auth_user_role() = 'admin');

-- ============================================================
-- Reference / lookup tables: all authenticated read, admin/editor write
-- Applies to: entities, entity_aliases, disease_states, sections,
--             subsections, outlets, outlet_lists, entity_disease_states,
--             outlet_list_members
-- ============================================================

-- entities
create policy "entities: authenticated read"
    on entities for select
    to authenticated
    using (true);

create policy "entities: editor/admin write"
    on entities for all
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));

-- entity_aliases
create policy "entity_aliases: authenticated read"
    on entity_aliases for select
    to authenticated
    using (true);

create policy "entity_aliases: editor/admin write"
    on entity_aliases for all
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));

-- disease_states
create policy "disease_states: authenticated read"
    on disease_states for select
    to authenticated
    using (true);

create policy "disease_states: editor/admin write"
    on disease_states for all
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));

-- sections
create policy "sections: authenticated read"
    on sections for select
    to authenticated
    using (true);

create policy "sections: editor/admin write"
    on sections for all
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));

-- subsections
create policy "subsections: authenticated read"
    on subsections for select
    to authenticated
    using (true);

create policy "subsections: editor/admin write"
    on subsections for all
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));

-- outlets
create policy "outlets: authenticated read"
    on outlets for select
    to authenticated
    using (true);

create policy "outlets: editor/admin write"
    on outlets for all
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));

-- outlet_lists
create policy "outlet_lists: authenticated read"
    on outlet_lists for select
    to authenticated
    using (true);

create policy "outlet_lists: editor/admin write"
    on outlet_lists for all
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));

-- entity_disease_states
create policy "entity_disease_states: authenticated read"
    on entity_disease_states for select
    to authenticated
    using (true);

create policy "entity_disease_states: editor/admin write"
    on entity_disease_states for all
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));

-- outlet_list_members
create policy "outlet_list_members: authenticated read"
    on outlet_list_members for select
    to authenticated
    using (true);

create policy "outlet_list_members: editor/admin write"
    on outlet_list_members for all
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));

-- ============================================================
-- rules, rule_conditions, rule_actions: read all auth, admin write
-- ============================================================

create policy "rules: authenticated read"
    on rules for select
    to authenticated
    using (true);

create policy "rules: admin write"
    on rules for all
    to authenticated
    using (auth_user_role() = 'admin')
    with check (auth_user_role() = 'admin');

create policy "rule_conditions: authenticated read"
    on rule_conditions for select
    to authenticated
    using (true);

create policy "rule_conditions: admin write"
    on rule_conditions for all
    to authenticated
    using (auth_user_role() = 'admin')
    with check (auth_user_role() = 'admin');

create policy "rule_actions: authenticated read"
    on rule_actions for select
    to authenticated
    using (true);

create policy "rule_actions: admin write"
    on rule_actions for all
    to authenticated
    using (auth_user_role() = 'admin')
    with check (auth_user_role() = 'admin');

-- ============================================================
-- item_flags: all authenticated read, all insert, editor/admin update
-- ============================================================

create policy "item_flags: authenticated read"
    on item_flags for select
    to authenticated
    using (true);

create policy "item_flags: authenticated insert"
    on item_flags for insert
    to authenticated
    with check (true);

create policy "item_flags: editor/admin update"
    on item_flags for update
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));

-- ============================================================
-- item_overrides: all authenticated read, all authenticated insert
-- ============================================================

create policy "item_overrides: authenticated read"
    on item_overrides for select
    to authenticated
    using (true);

create policy "item_overrides: authenticated insert"
    on item_overrides for insert
    to authenticated
    with check (true);

-- ============================================================
-- source_adapters, ingestion_runs: read all auth, admin write
-- ============================================================

create policy "source_adapters: authenticated read"
    on source_adapters for select
    to authenticated
    using (true);

create policy "source_adapters: admin write"
    on source_adapters for all
    to authenticated
    using (auth_user_role() = 'admin')
    with check (auth_user_role() = 'admin');

create policy "ingestion_runs: authenticated read"
    on ingestion_runs for select
    to authenticated
    using (true);

create policy "ingestion_runs: admin write"
    on ingestion_runs for all
    to authenticated
    using (auth_user_role() = 'admin')
    with check (auth_user_role() = 'admin');

-- ============================================================
-- digest_runs, digest_items: read all auth, editor/admin write
-- ============================================================

create policy "digest_runs: authenticated read"
    on digest_runs for select
    to authenticated
    using (true);

create policy "digest_runs: editor/admin write"
    on digest_runs for all
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));

create policy "digest_items: authenticated read"
    on digest_items for select
    to authenticated
    using (true);

create policy "digest_items: editor/admin write"
    on digest_items for all
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));

-- ============================================================
-- schedules, alert_recipients: read all auth, admin write
-- ============================================================

create policy "schedules: authenticated read"
    on schedules for select
    to authenticated
    using (true);

create policy "schedules: admin write"
    on schedules for all
    to authenticated
    using (auth_user_role() = 'admin')
    with check (auth_user_role() = 'admin');

create policy "alert_recipients: authenticated read"
    on alert_recipients for select
    to authenticated
    using (true);

create policy "alert_recipients: admin write"
    on alert_recipients for all
    to authenticated
    using (auth_user_role() = 'admin')
    with check (auth_user_role() = 'admin');

-- ============================================================
-- attachments: read all auth, editor/admin insert
-- ============================================================

create policy "attachments: authenticated read"
    on attachments for select
    to authenticated
    using (true);

create policy "attachments: editor/admin insert"
    on attachments for insert
    to authenticated
    with check (auth_user_role() in ('editor', 'admin'));

-- ============================================================
-- audit_log: read all auth, insert via service role only
-- ============================================================

create policy "audit_log: authenticated read"
    on audit_log for select
    to authenticated
    using (true);

-- Service role bypasses RLS entirely by default; no insert policy
-- needed here for service-role callers. The explicit policy below
-- blocks direct inserts from the anon / authenticated roles so that
-- the log is only writable by server-side code running as service_role.

-- ============================================================
-- story_clusters: read all auth, editor/admin write
-- ============================================================

create policy "story_clusters: authenticated read"
    on story_clusters for select
    to authenticated
    using (true);

create policy "story_clusters: editor/admin write"
    on story_clusters for all
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));

-- ============================================================
-- article_entities, article_sections: read all auth, editor/admin write
-- ============================================================

create policy "article_entities: authenticated read"
    on article_entities for select
    to authenticated
    using (true);

create policy "article_entities: editor/admin write"
    on article_entities for all
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));

create policy "article_sections: authenticated read"
    on article_sections for select
    to authenticated
    using (true);

create policy "article_sections: editor/admin write"
    on article_sections for all
    to authenticated
    using (auth_user_role() in ('editor', 'admin'))
    with check (auth_user_role() in ('editor', 'admin'));
