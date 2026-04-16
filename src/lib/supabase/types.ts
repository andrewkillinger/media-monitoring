// Database type definitions for Acadia Media Monitoring
// Generated from supabase/migrations schema

// ─── Enum types ──────────────────────────────────────────────────────────────

export type UserRole = "admin" | "editor" | "reviewer";

export type ArticleStatus =
  | "pending"
  | "classified"
  | "reviewed"
  | "published"
  | "excluded"
  | "duplicate";

export type ReviewStatus =
  | "needs_review"
  | "approved"
  | "rejected"
  | "reclassified";

export type RuleType =
  | "inclusion"
  | "exclusion"
  | "assignment"
  | "alert"
  | "tagging";

export type MatchMode = "all" | "any";

export type ConditionField =
  | "title"
  | "body"
  | "full_text"
  | "outlet"
  | "outlet_list"
  | "entity"
  | "product"
  | "disease_state"
  | "region"
  | "language"
  | "media_type"
  | "tag"
  | "author"
  | "sentiment";

export type ConditionOperator =
  | "contains"
  | "not_contains"
  | "matches_regex"
  | "in_list"
  | "not_in_list"
  | "equals"
  | "not_equals"
  | "exists"
  | "not_exists";

export type ActionType =
  | "assign_section"
  | "assign_subsection"
  | "add_tag"
  | "set_priority"
  | "trigger_alert"
  | "exclude"
  | "flag_review"
  | "set_sentiment";

export type SourceType =
  | "rss"
  | "google_news"
  | "manual_url"
  | "csv_import"
  | "json_import"
  | "twitter_manual"
  | "file_upload"
  | "meltwater"
  | "factiva"
  | "talkwalker"
  | "tveyes"
  | "webhook";

export type DigestStatus =
  | "draft"
  | "generated"
  | "reviewed"
  | "sent"
  | "archived";

export type OutletTier =
  | "tier1"
  | "tier2"
  | "tier3"
  | "trade"
  | "local"
  | "social"
  | "other";

export type AlertSeverity = "critical" | "high" | "medium" | "low";

export type AlertStatus = "new" | "reviewing" | "sent" | "resolved" | "corrected";

export type ChannelType = "print" | "online" | "broadcast" | "social" | "wire";

export type FulltextStatus = "public" | "licensed" | "uploaded" | "unavailable";

export type TranslationStatus = "none" | "machine" | "manual";

export type IngestionRunStatus = "running" | "completed" | "failed";

export type EntityType = "company" | "organization" | "product" | "molecule" | "person";

export type RelationshipType = "treats" | "competes_in" | "researches";

export type OutletListType = "priority" | "exclude" | "monitor";

export type MatchLocation = "title" | "body" | "both";

export type FlagType =
  | "acadia_earned"
  | "acadia_data"
  | "acadia_personnel"
  | "catch_correct"
  | "issues_related"
  | "competitor_milestone"
  | "negative_product"
  | "drug_pricing"
  | "litigation"
  | "regulatory"
  | "ma_update"
  | "custom";

export type ItemOverrideType =
  | "include"
  | "exclude"
  | "reclassify"
  | "update_section"
  | "update_priority"
  | "correct";

export type ScheduleType =
  | "daily_newsletter"
  | "milestone_eod"
  | "milestone_morning"
  | "ad_hoc"
  | "quarterly"
  | "annual";

// ─── Table row types ──────────────────────────────────────────────────────────

export type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProfileInsert = {
  id: string;
  email: string;
  full_name?: string | null;
  role?: UserRole;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ProfileUpdate = {
  id?: string;
  email?: string;
  full_name?: string | null;
  role?: UserRole;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type DiseaseStateRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type DiseaseStateInsert = {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export type DiseaseStateUpdate = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  is_active?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export type EntityRow = {
  id: string;
  name: string;
  slug: string;
  entity_type: EntityType;
  is_primary: boolean;
  is_competitor: boolean;
  parent_entity_id: string | null;
  metadata: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type EntityInsert = {
  id?: string;
  name: string;
  slug: string;
  entity_type: EntityType;
  is_primary?: boolean;
  is_competitor?: boolean;
  parent_entity_id?: string | null;
  metadata?: Record<string, unknown>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type EntityUpdate = {
  id?: string;
  name?: string;
  slug?: string;
  entity_type?: EntityType;
  is_primary?: boolean;
  is_competitor?: boolean;
  parent_entity_id?: string | null;
  metadata?: Record<string, unknown>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type EntityAliasRow = {
  id: string;
  entity_id: string;
  alias_text: string;
  is_primary: boolean;
  created_at: string;
}

export type EntityAliasInsert = {
  id?: string;
  entity_id: string;
  alias_text: string;
  is_primary?: boolean;
  created_at?: string;
}

export type EntityAliasUpdate = {
  id?: string;
  entity_id?: string;
  alias_text?: string;
  is_primary?: boolean;
  created_at?: string;
}

export type EntityDiseaseStateRow = {
  entity_id: string;
  disease_state_id: string;
  relationship_type: RelationshipType | null;
}

export type EntityDiseaseStateInsert = {
  entity_id: string;
  disease_state_id: string;
  relationship_type?: RelationshipType | null;
}

export type EntityDiseaseStateUpdate = {
  entity_id?: string;
  disease_state_id?: string;
  relationship_type?: RelationshipType | null;
}

export type SectionRow = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  display_order: number;
  is_active: boolean;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type SectionInsert = {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  display_order?: number;
  is_active?: boolean;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type SectionUpdate = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  display_order?: number;
  is_active?: boolean;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type SubsectionRow = {
  id: string;
  section_id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type SubsectionInsert = {
  id?: string;
  section_id: string;
  name: string;
  slug: string;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type SubsectionUpdate = {
  id?: string;
  section_id?: string;
  name?: string;
  slug?: string;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type OutletRow = {
  id: string;
  name: string;
  slug: string;
  tier: OutletTier;
  channel: ChannelType;
  url: string | null;
  region: string | null;
  country: string | null;
  language: string;
  is_priority: boolean;
  is_excluded: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type OutletInsert = {
  id?: string;
  name: string;
  slug: string;
  tier?: OutletTier;
  channel?: ChannelType;
  url?: string | null;
  region?: string | null;
  country?: string | null;
  language?: string;
  is_priority?: boolean;
  is_excluded?: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export type OutletUpdate = {
  id?: string;
  name?: string;
  slug?: string;
  tier?: OutletTier;
  channel?: ChannelType;
  url?: string | null;
  region?: string | null;
  country?: string | null;
  language?: string;
  is_priority?: boolean;
  is_excluded?: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export type OutletListRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  list_type: OutletListType | null;
  created_at: string;
}

export type OutletListInsert = {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  list_type?: OutletListType | null;
  created_at?: string;
}

export type OutletListUpdate = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  list_type?: OutletListType | null;
  created_at?: string;
}

export type OutletListMemberRow = {
  outlet_list_id: string;
  outlet_id: string;
}

export type OutletListMemberInsert = {
  outlet_list_id: string;
  outlet_id: string;
}

export type OutletListMemberUpdate = {
  outlet_list_id?: string;
  outlet_id?: string;
}

export type SourceAdapterRow = {
  id: string;
  name: string;
  adapter_type: SourceType;
  settings: Record<string, unknown>;
  credentials_encrypted: Record<string, unknown> | null;
  is_active: boolean;
  fetch_interval_minutes: number;
  last_fetched_at: string | null;
  last_cursor: string | null;
  created_at: string;
  updated_at: string;
}

export type SourceAdapterInsert = {
  id?: string;
  name: string;
  adapter_type: SourceType;
  settings?: Record<string, unknown>;
  credentials_encrypted?: Record<string, unknown> | null;
  is_active?: boolean;
  fetch_interval_minutes?: number;
  last_fetched_at?: string | null;
  last_cursor?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SourceAdapterUpdate = {
  id?: string;
  name?: string;
  adapter_type?: SourceType;
  settings?: Record<string, unknown>;
  credentials_encrypted?: Record<string, unknown> | null;
  is_active?: boolean;
  fetch_interval_minutes?: number;
  last_fetched_at?: string | null;
  last_cursor?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type IngestionRunRow = {
  id: string;
  source_adapter_id: string | null;
  started_at: string;
  completed_at: string | null;
  status: IngestionRunStatus;
  items_fetched: number;
  items_new: number;
  items_duplicate: number;
  items_error: number;
  error_message: string | null;
  metadata: Record<string, unknown>;
}

export type IngestionRunInsert = {
  id?: string;
  source_adapter_id?: string | null;
  started_at?: string;
  completed_at?: string | null;
  status?: IngestionRunStatus;
  items_fetched?: number;
  items_new?: number;
  items_duplicate?: number;
  items_error?: number;
  error_message?: string | null;
  metadata?: Record<string, unknown>;
}

export type IngestionRunUpdate = {
  id?: string;
  source_adapter_id?: string | null;
  started_at?: string;
  completed_at?: string | null;
  status?: IngestionRunStatus;
  items_fetched?: number;
  items_new?: number;
  items_duplicate?: number;
  items_error?: number;
  error_message?: string | null;
  metadata?: Record<string, unknown>;
}

export type ArticleRow = {
  id: string;
  source_adapter_id: string | null;
  ingestion_run_id: string | null;
  external_id: string | null;
  url: string;
  canonical_url: string | null;
  url_hash: string; // generated always
  title: string;
  title_normalized: string | null;
  author: string | null;
  byline: string | null;
  outlet_id: string | null;
  outlet_name_raw: string | null;
  published_at: string | null;
  fetched_at: string;
  body_snippet: string | null;
  language: string;
  original_language: string | null;
  translated_title: string | null;
  translated_summary: string | null;
  translation_status: TranslationStatus | null;
  region: string | null;
  country: string | null;
  channel: ChannelType;
  media_type: string | null;
  status: ArticleStatus;
  review_status: ReviewStatus | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  is_paywalled: boolean;
  fulltext_status: FulltextStatus;
  is_syndicated: boolean;
  cluster_id: string | null;
  is_cluster_primary: boolean;
  priority_score: number;
  sentiment: string | null;
  ai_summary: string | null;
  ai_confidence: number | null;
  inclusion_rationale: string | null;
  exclusion_rationale: string | null;
  social_author_handle: string | null;
  social_display_name: string | null;
  social_follower_count: number | null;
  social_engagement_metrics: Record<string, unknown> | null;
  social_is_sampled: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type ArticleInsert = {
  id?: string;
  source_adapter_id?: string | null;
  ingestion_run_id?: string | null;
  external_id?: string | null;
  url: string;
  canonical_url?: string | null;
  title: string;
  title_normalized?: string | null;
  author?: string | null;
  byline?: string | null;
  outlet_id?: string | null;
  outlet_name_raw?: string | null;
  published_at?: string | null;
  fetched_at?: string;
  body_snippet?: string | null;
  language?: string;
  original_language?: string | null;
  translated_title?: string | null;
  translated_summary?: string | null;
  translation_status?: TranslationStatus | null;
  region?: string | null;
  country?: string | null;
  channel?: ChannelType;
  media_type?: string | null;
  status?: ArticleStatus;
  review_status?: ReviewStatus | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  review_notes?: string | null;
  is_paywalled?: boolean;
  fulltext_status?: FulltextStatus;
  is_syndicated?: boolean;
  cluster_id?: string | null;
  is_cluster_primary?: boolean;
  priority_score?: number;
  sentiment?: string | null;
  ai_summary?: string | null;
  ai_confidence?: number | null;
  inclusion_rationale?: string | null;
  exclusion_rationale?: string | null;
  social_author_handle?: string | null;
  social_display_name?: string | null;
  social_follower_count?: number | null;
  social_engagement_metrics?: Record<string, unknown> | null;
  social_is_sampled?: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export type ArticleUpdate = {
  id?: string;
  source_adapter_id?: string | null;
  ingestion_run_id?: string | null;
  external_id?: string | null;
  url?: string;
  canonical_url?: string | null;
  title?: string;
  title_normalized?: string | null;
  author?: string | null;
  byline?: string | null;
  outlet_id?: string | null;
  outlet_name_raw?: string | null;
  published_at?: string | null;
  fetched_at?: string;
  body_snippet?: string | null;
  language?: string;
  original_language?: string | null;
  translated_title?: string | null;
  translated_summary?: string | null;
  translation_status?: TranslationStatus | null;
  region?: string | null;
  country?: string | null;
  channel?: ChannelType;
  media_type?: string | null;
  status?: ArticleStatus;
  review_status?: ReviewStatus | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  review_notes?: string | null;
  is_paywalled?: boolean;
  fulltext_status?: FulltextStatus;
  is_syndicated?: boolean;
  cluster_id?: string | null;
  is_cluster_primary?: boolean;
  priority_score?: number;
  sentiment?: string | null;
  ai_summary?: string | null;
  ai_confidence?: number | null;
  inclusion_rationale?: string | null;
  exclusion_rationale?: string | null;
  social_author_handle?: string | null;
  social_display_name?: string | null;
  social_follower_count?: number | null;
  social_engagement_metrics?: Record<string, unknown> | null;
  social_is_sampled?: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export type StoryClusterRow = {
  id: string;
  primary_article_id: string | null;
  title: string | null;
  article_count: number;
  created_at: string;
  updated_at: string;
}

export type StoryClusterInsert = {
  id?: string;
  primary_article_id?: string | null;
  title?: string | null;
  article_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type StoryClusterUpdate = {
  id?: string;
  primary_article_id?: string | null;
  title?: string | null;
  article_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type ArticleEntityRow = {
  id: string;
  article_id: string;
  entity_id: string;
  matched_alias: string | null;
  match_location: MatchLocation | null;
  is_primary_mention: boolean;
  created_at: string;
}

export type ArticleEntityInsert = {
  id?: string;
  article_id: string;
  entity_id: string;
  matched_alias?: string | null;
  match_location?: MatchLocation | null;
  is_primary_mention?: boolean;
  created_at?: string;
}

export type ArticleEntityUpdate = {
  id?: string;
  article_id?: string;
  entity_id?: string;
  matched_alias?: string | null;
  match_location?: MatchLocation | null;
  is_primary_mention?: boolean;
  created_at?: string;
}

export type ArticleSectionRow = {
  id: string;
  article_id: string;
  section_id: string;
  subsection_id: string | null;
  assigned_by_rule_id: string | null;
  is_manual_override: boolean;
  created_at: string;
}

export type ArticleSectionInsert = {
  id?: string;
  article_id: string;
  section_id: string;
  subsection_id?: string | null;
  assigned_by_rule_id?: string | null;
  is_manual_override?: boolean;
  created_at?: string;
}

export type ArticleSectionUpdate = {
  id?: string;
  article_id?: string;
  section_id?: string;
  subsection_id?: string | null;
  assigned_by_rule_id?: string | null;
  is_manual_override?: boolean;
  created_at?: string;
}

export type RuleRow = {
  id: string;
  name: string;
  description: string | null;
  priority: number;
  is_active: boolean;
  rule_type: RuleType;
  match_mode: MatchMode;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type RuleInsert = {
  id?: string;
  name: string;
  description?: string | null;
  priority?: number;
  is_active?: boolean;
  rule_type: RuleType;
  match_mode?: MatchMode;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type RuleUpdate = {
  id?: string;
  name?: string;
  description?: string | null;
  priority?: number;
  is_active?: boolean;
  rule_type?: RuleType;
  match_mode?: MatchMode;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type RuleConditionRow = {
  id: string;
  rule_id: string;
  field: ConditionField;
  operator: ConditionOperator;
  value: string;
  is_negated: boolean;
  group_id: number;
  group_mode: MatchMode;
  created_at: string;
}

export type RuleConditionInsert = {
  id?: string;
  rule_id: string;
  field: ConditionField;
  operator: ConditionOperator;
  value: string;
  is_negated?: boolean;
  group_id?: number;
  group_mode?: MatchMode;
  created_at?: string;
}

export type RuleConditionUpdate = {
  id?: string;
  rule_id?: string;
  field?: ConditionField;
  operator?: ConditionOperator;
  value?: string;
  is_negated?: boolean;
  group_id?: number;
  group_mode?: MatchMode;
  created_at?: string;
}

export type RuleActionRow = {
  id: string;
  rule_id: string;
  action_type: ActionType;
  target_id: string | null;
  target_value: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type RuleActionInsert = {
  id?: string;
  rule_id: string;
  action_type: ActionType;
  target_id?: string | null;
  target_value?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export type RuleActionUpdate = {
  id?: string;
  rule_id?: string;
  action_type?: ActionType;
  target_id?: string | null;
  target_value?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export type ItemFlagRow = {
  id: string;
  article_id: string;
  flag_type: FlagType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string | null;
  notes: string | null;
  created_by: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  hold_from_newsletter: boolean;
  created_at: string;
  updated_at: string;
}

export type ItemFlagInsert = {
  id?: string;
  article_id: string;
  flag_type: FlagType;
  severity?: AlertSeverity;
  status?: AlertStatus;
  title?: string | null;
  notes?: string | null;
  created_by?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  hold_from_newsletter?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ItemFlagUpdate = {
  id?: string;
  article_id?: string;
  flag_type?: FlagType;
  severity?: AlertSeverity;
  status?: AlertStatus;
  title?: string | null;
  notes?: string | null;
  created_by?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  hold_from_newsletter?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ItemOverrideRow = {
  id: string;
  article_id: string;
  override_type: ItemOverrideType | null;
  previous_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  reason: string | null;
  created_by: string;
  created_at: string;
}

export type ItemOverrideInsert = {
  id?: string;
  article_id: string;
  override_type?: ItemOverrideType | null;
  previous_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  reason?: string | null;
  created_by: string;
  created_at?: string;
}

export type ItemOverrideUpdate = {
  id?: string;
  article_id?: string;
  override_type?: ItemOverrideType | null;
  previous_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  reason?: string | null;
  created_by?: string;
  created_at?: string;
}

export type ScheduleRow = {
  id: string;
  name: string;
  schedule_type: ScheduleType;
  cron_expression: string | null;
  timezone: string;
  coverage_cutoff_minutes: number | null;
  is_active: boolean;
  config: Record<string, unknown>;
  last_run_at: string | null;
  next_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ScheduleInsert = {
  id?: string;
  name: string;
  schedule_type: ScheduleType;
  cron_expression?: string | null;
  timezone?: string;
  coverage_cutoff_minutes?: number | null;
  is_active?: boolean;
  config?: Record<string, unknown>;
  last_run_at?: string | null;
  next_run_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type ScheduleUpdate = {
  id?: string;
  name?: string;
  schedule_type?: ScheduleType;
  cron_expression?: string | null;
  timezone?: string;
  coverage_cutoff_minutes?: number | null;
  is_active?: boolean;
  config?: Record<string, unknown>;
  last_run_at?: string | null;
  next_run_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type AlertRecipientRow = {
  id: string;
  schedule_id: string | null;
  email: string;
  name: string | null;
  is_active: boolean;
  alert_types: string[] | null;
  created_at: string;
}

export type AlertRecipientInsert = {
  id?: string;
  schedule_id?: string | null;
  email: string;
  name?: string | null;
  is_active?: boolean;
  alert_types?: string[] | null;
  created_at?: string;
}

export type AlertRecipientUpdate = {
  id?: string;
  schedule_id?: string | null;
  email?: string;
  name?: string | null;
  is_active?: boolean;
  alert_types?: string[] | null;
  created_at?: string;
}

export type DigestRunRow = {
  id: string;
  schedule_id: string | null;
  digest_date: string;
  status: DigestStatus;
  coverage_start: string | null;
  coverage_end: string | null;
  overview_text: string | null;
  generated_html: string | null;
  generated_markdown: string | null;
  generated_by: string | null;
  reviewed_by: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export type DigestRunInsert = {
  id?: string;
  schedule_id?: string | null;
  digest_date: string;
  status?: DigestStatus;
  coverage_start?: string | null;
  coverage_end?: string | null;
  overview_text?: string | null;
  generated_html?: string | null;
  generated_markdown?: string | null;
  generated_by?: string | null;
  reviewed_by?: string | null;
  sent_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type DigestRunUpdate = {
  id?: string;
  schedule_id?: string | null;
  digest_date?: string;
  status?: DigestStatus;
  coverage_start?: string | null;
  coverage_end?: string | null;
  overview_text?: string | null;
  generated_html?: string | null;
  generated_markdown?: string | null;
  generated_by?: string | null;
  reviewed_by?: string | null;
  sent_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type DigestItemRow = {
  id: string;
  digest_run_id: string;
  article_id: string;
  section_id: string;
  subsection_id: string | null;
  display_order: number;
  display_headline: string | null;
  display_outlet: string | null;
  created_at: string;
}

export type DigestItemInsert = {
  id?: string;
  digest_run_id: string;
  article_id: string;
  section_id: string;
  subsection_id?: string | null;
  display_order?: number;
  display_headline?: string | null;
  display_outlet?: string | null;
  created_at?: string;
}

export type DigestItemUpdate = {
  id?: string;
  digest_run_id?: string;
  article_id?: string;
  section_id?: string;
  subsection_id?: string | null;
  display_order?: number;
  display_headline?: string | null;
  display_outlet?: string | null;
  created_at?: string;
}

export type AttachmentRow = {
  id: string;
  article_id: string;
  file_name: string;
  file_type: string | null;
  storage_path: string;
  file_size_bytes: number | null;
  uploaded_by: string | null;
  is_full_text: boolean;
  created_at: string;
}

export type AttachmentInsert = {
  id?: string;
  article_id: string;
  file_name: string;
  file_type?: string | null;
  storage_path: string;
  file_size_bytes?: number | null;
  uploaded_by?: string | null;
  is_full_text?: boolean;
  created_at?: string;
}

export type AttachmentUpdate = {
  id?: string;
  article_id?: string;
  file_name?: string;
  file_type?: string | null;
  storage_path?: string;
  file_size_bytes?: number | null;
  uploaded_by?: string | null;
  is_full_text?: boolean;
  created_at?: string;
}

export type AuditLogRow = {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export type AuditLogInsert = {
  id?: string;
  user_id?: string | null;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  old_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
  ip_address?: string | null;
  created_at?: string;
}

export type AuditLogUpdate = {
  id?: string;
  user_id?: string | null;
  action?: string;
  resource_type?: string;
  resource_id?: string | null;
  old_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
  ip_address?: string | null;
  created_at?: string;
}

// ─── Database interface ───────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: never[];
      };
      disease_states: {
        Row: DiseaseStateRow;
        Insert: DiseaseStateInsert;
        Update: DiseaseStateUpdate;
        Relationships: never[];
      };
      entities: {
        Row: EntityRow;
        Insert: EntityInsert;
        Update: EntityUpdate;
        Relationships: never[];
      };
      entity_aliases: {
        Row: EntityAliasRow;
        Insert: EntityAliasInsert;
        Update: EntityAliasUpdate;
        Relationships: never[];
      };
      entity_disease_states: {
        Row: EntityDiseaseStateRow;
        Insert: EntityDiseaseStateInsert;
        Update: EntityDiseaseStateUpdate;
        Relationships: never[];
      };
      sections: {
        Row: SectionRow;
        Insert: SectionInsert;
        Update: SectionUpdate;
        Relationships: never[];
      };
      subsections: {
        Row: SubsectionRow;
        Insert: SubsectionInsert;
        Update: SubsectionUpdate;
        Relationships: never[];
      };
      outlets: {
        Row: OutletRow;
        Insert: OutletInsert;
        Update: OutletUpdate;
        Relationships: never[];
      };
      outlet_lists: {
        Row: OutletListRow;
        Insert: OutletListInsert;
        Update: OutletListUpdate;
        Relationships: never[];
      };
      outlet_list_members: {
        Row: OutletListMemberRow;
        Insert: OutletListMemberInsert;
        Update: OutletListMemberUpdate;
        Relationships: never[];
      };
      source_adapters: {
        Row: SourceAdapterRow;
        Insert: SourceAdapterInsert;
        Update: SourceAdapterUpdate;
        Relationships: never[];
      };
      ingestion_runs: {
        Row: IngestionRunRow;
        Insert: IngestionRunInsert;
        Update: IngestionRunUpdate;
        Relationships: never[];
      };
      articles: {
        Row: ArticleRow;
        Insert: ArticleInsert;
        Update: ArticleUpdate;
        Relationships: never[];
      };
      story_clusters: {
        Row: StoryClusterRow;
        Insert: StoryClusterInsert;
        Update: StoryClusterUpdate;
        Relationships: never[];
      };
      article_entities: {
        Row: ArticleEntityRow;
        Insert: ArticleEntityInsert;
        Update: ArticleEntityUpdate;
        Relationships: never[];
      };
      article_sections: {
        Row: ArticleSectionRow;
        Insert: ArticleSectionInsert;
        Update: ArticleSectionUpdate;
        Relationships: never[];
      };
      rules: {
        Row: RuleRow;
        Insert: RuleInsert;
        Update: RuleUpdate;
        Relationships: never[];
      };
      rule_conditions: {
        Row: RuleConditionRow;
        Insert: RuleConditionInsert;
        Update: RuleConditionUpdate;
        Relationships: never[];
      };
      rule_actions: {
        Row: RuleActionRow;
        Insert: RuleActionInsert;
        Update: RuleActionUpdate;
        Relationships: never[];
      };
      item_flags: {
        Row: ItemFlagRow;
        Insert: ItemFlagInsert;
        Update: ItemFlagUpdate;
        Relationships: never[];
      };
      item_overrides: {
        Row: ItemOverrideRow;
        Insert: ItemOverrideInsert;
        Update: ItemOverrideUpdate;
        Relationships: never[];
      };
      schedules: {
        Row: ScheduleRow;
        Insert: ScheduleInsert;
        Update: ScheduleUpdate;
        Relationships: never[];
      };
      alert_recipients: {
        Row: AlertRecipientRow;
        Insert: AlertRecipientInsert;
        Update: AlertRecipientUpdate;
        Relationships: never[];
      };
      digest_runs: {
        Row: DigestRunRow;
        Insert: DigestRunInsert;
        Update: DigestRunUpdate;
        Relationships: never[];
      };
      digest_items: {
        Row: DigestItemRow;
        Insert: DigestItemInsert;
        Update: DigestItemUpdate;
        Relationships: never[];
      };
      attachments: {
        Row: AttachmentRow;
        Insert: AttachmentInsert;
        Update: AttachmentUpdate;
        Relationships: never[];
      };
      audit_log: {
        Row: AuditLogRow;
        Insert: AuditLogInsert;
        Update: AuditLogUpdate;
        Relationships: never[];
      };
    };
    Views: Record<string, {
      Row: Record<string, unknown>;
      Relationships: {
        foreignKeyName: string;
        columns: string[];
        isOneToOne?: boolean;
        referencedRelation: string;
        referencedColumns: string[];
      }[];
    }>;
    Functions: Record<string, {
      Args: Record<string, unknown> | never;
      Returns: unknown;
    }>;
    CompositeTypes: Record<string, Record<string, unknown>>;
    Enums: {
      user_role: UserRole;
      article_status: ArticleStatus;
      review_status: ReviewStatus;
      rule_type: RuleType;
      match_mode: MatchMode;
      condition_field: ConditionField;
      condition_operator: ConditionOperator;
      action_type: ActionType;
      source_type: SourceType;
      digest_status: DigestStatus;
      outlet_tier: OutletTier;
      alert_severity: AlertSeverity;
      alert_status: AlertStatus;
      channel_type: ChannelType;
      fulltext_status: FulltextStatus;
    };
  };
}
