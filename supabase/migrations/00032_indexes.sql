-- Performance indexes

-- ============================================================
-- articles
-- ============================================================

create index idx_articles_published_at
    on articles (published_at desc);

create index idx_articles_status
    on articles (status);

create index idx_articles_review_status
    on articles (review_status);

create index idx_articles_outlet_id
    on articles (outlet_id);

create index idx_articles_channel
    on articles (channel);

create index idx_articles_region
    on articles (region);

create index idx_articles_country
    on articles (country);

create index idx_articles_language
    on articles (language);

create index idx_articles_cluster_id
    on articles (cluster_id);

create index idx_articles_priority_score
    on articles (priority_score desc);

-- url_hash already has a UNIQUE constraint (which creates a unique index)
-- Adding an explicit non-unique index is redundant; the constraint index suffices.

-- GIN index for fuzzy title search (requires pg_trgm)
create index idx_articles_title_trgm
    on articles using gin (title gin_trgm_ops);

-- GIN index for JSONB metadata queries
create index idx_articles_metadata
    on articles using gin (metadata jsonb_path_ops);

-- ============================================================
-- article_entities
-- ============================================================

create index idx_article_entities_article_id
    on article_entities (article_id);

create index idx_article_entities_entity_id
    on article_entities (entity_id);

-- ============================================================
-- article_sections
-- ============================================================

create index idx_article_sections_article_id
    on article_sections (article_id);

create index idx_article_sections_section_id
    on article_sections (section_id);

-- ============================================================
-- entity_aliases
-- ============================================================

create index idx_entity_aliases_entity_id
    on entity_aliases (entity_id);

-- Case-insensitive alias lookup
create index idx_entity_aliases_lower_alias
    on entity_aliases (lower(alias_text));

-- ============================================================
-- item_flags
-- ============================================================

create index idx_item_flags_article_id
    on item_flags (article_id);

create index idx_item_flags_status
    on item_flags (status);

create index idx_item_flags_severity
    on item_flags (severity);

create index idx_item_flags_flag_type
    on item_flags (flag_type);

-- ============================================================
-- item_overrides
-- ============================================================

create index idx_item_overrides_article_id
    on item_overrides (article_id);

-- ============================================================
-- ingestion_runs
-- ============================================================

create index idx_ingestion_runs_source_adapter_id
    on ingestion_runs (source_adapter_id);

create index idx_ingestion_runs_started_at
    on ingestion_runs (started_at desc);

-- ============================================================
-- digest_runs
-- ============================================================

create index idx_digest_runs_digest_date
    on digest_runs (digest_date desc);

create index idx_digest_runs_status
    on digest_runs (status);

-- ============================================================
-- digest_items
-- ============================================================

create index idx_digest_items_digest_run_id
    on digest_items (digest_run_id);

create index idx_digest_items_section_id
    on digest_items (section_id);

-- ============================================================
-- audit_log
-- ============================================================

create index idx_audit_log_resource_type
    on audit_log (resource_type);

create index idx_audit_log_resource_id
    on audit_log (resource_id);

create index idx_audit_log_created_at
    on audit_log (created_at desc);

-- ============================================================
-- rules
-- ============================================================

create index idx_rules_rule_type
    on rules (rule_type);

create index idx_rules_is_active
    on rules (is_active);

create index idx_rules_priority
    on rules (priority);
