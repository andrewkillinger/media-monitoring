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

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  email: string;
  full_name?: string | null;
  role?: UserRole;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdate {
  id?: string;
  email?: string;
  full_name?: string | null;
  role?: UserRole;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DiseaseStateRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DiseaseStateInsert {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DiseaseStateUpdate {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  is_active?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface EntityRow {
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

export interface EntityInsert {
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

export interface EntityUpdate {
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

export interface EntityAliasRow {
  id: string;
  entity_id: string;
  alias_text: string;
  is_primary: boolean;
  created_at: string;
}

export interface EntityAliasInsert {
  id?: string;
  entity_id: string;
  alias_text: string;
  is_primary?: boolean;
  created_at?: string;
}

export interface EntityAliasUpdate {
  id?: string;
  entity_id?: string;
  alias_text?: string;
  is_primary?: boolean;
  created_at?: string;
}

export interface EntityDiseaseStateRow {
  entity_id: string;
  disease_state_id: string;
  relationship_type: RelationshipType | null;
}

export interface EntityDiseaseStateInsert {
  entity_id: string;
  disease_state_id: string;
  relationship_type?: RelationshipType | null;
}

export interface EntityDiseaseStateUpdate {
  entity_id?: string;
  disease_state_id?: string;
  relationship_type?: RelationshipType | null;
}

export interface SectionRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface SectionInsert {
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

export interface SectionUpdate {
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

export interface SubsectionRow {
  id: string;
  section_id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubsectionInsert {
  id?: string;
  section_id: string;
  name: string;
  slug: string;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SubsectionUpdate {
  id?: string;
  section_id?: string;
  name?: string;
  slug?: string;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OutletRow {
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

export interface OutletInsert {
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

export interface OutletUpdate {
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

export interface OutletListRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  list_type: OutletListType | null;
  created_at: string;
}

export interface OutletListInsert {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  list_type?: OutletListType | null;
  created_at?: string;
}

export interface OutletListUpdate {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  list_type?: OutletListType | null;
  created_at?: string;
}

export interface OutletListMemberRow {
  outlet_list_id: string;
  outlet_id: string;
}

export interface OutletListMemberInsert {
  outlet_list_id: string;
  outlet_id: string;
}

export interface OutletListMemberUpdate {
  outlet_list_id?: string;
  outlet_id?: string;
}

export interface SourceAdapterRow {
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

export interface SourceAdapterInsert {
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

export interface SourceAdapterUpdate {
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

export interface IngestionRunRow {
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

export interface IngestionRunInsert {
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

export interface IngestionRunUpdate {
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

export interface ArticleRow {
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

export interface ArticleInsert {
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

export interface ArticleUpdate {
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

export interface StoryClusterRow {
  id: string;
  primary_article_id: string | null;
  title: string | null;
  article_count: number;
  created_at: string;
  updated_at: string;
}

export interface StoryClusterInsert {
  id?: string;
  primary_article_id?: string | null;
  title?: string | null;
  article_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StoryClusterUpdate {
  id?: string;
  primary_article_id?: string | null;
  title?: string | null;
  article_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleEntityRow {
  id: string;
  article_id: string;
  entity_id: string;
  matched_alias: string | null;
  match_location: MatchLocation | null;
  is_primary_mention: boolean;
  created_at: string;
}

export interface ArticleEntityInsert {
  id?: string;
  article_id: string;
  entity_id: string;
  matched_alias?: string | null;
  match_location?: MatchLocation | null;
  is_primary_mention?: boolean;
  created_at?: string;
}

export interface ArticleEntityUpdate {
  id?: string;
  article_id?: string;
  entity_id?: string;
  matched_alias?: string | null;
  match_location?: MatchLocation | null;
  is_primary_mention?: boolean;
  created_at?: string;
}

export interface ArticleSectionRow {
  id: string;
  article_id: string;
  section_id: string;
  subsection_id: string | null;
  assigned_by_rule_id: string | null;
  is_manual_override: boolean;
  created_at: string;
}

export interface ArticleSectionInsert {
  id?: string;
  article_id: string;
  section_id: string;
  subsection_id?: string | null;
  assigned_by_rule_id?: string | null;
  is_manual_override?: boolean;
  created_at?: string;
}

export interface ArticleSectionUpdate {
  id?: string;
  article_id?: string;
  section_id?: string;
  subsection_id?: string | null;
  assigned_by_rule_id?: string | null;
  is_manual_override?: boolean;
  created_at?: string;
}

export interface RuleRow {
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

export interface RuleInsert {
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

export interface RuleUpdate {
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

export interface RuleConditionRow {
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

export interface RuleConditionInsert {
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

export interface RuleConditionUpdate {
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

export interface RuleActionRow {
  id: string;
  rule_id: string;
  action_type: ActionType;
  target_id: string | null;
  target_value: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface RuleActionInsert {
  id?: string;
  rule_id: string;
  action_type: ActionType;
  target_id?: string | null;
  target_value?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface RuleActionUpdate {
  id?: string;
  rule_id?: string;
  action_type?: ActionType;
  target_id?: string | null;
  target_value?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface ItemFlagRow {
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

export interface ItemFlagInsert {
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

export interface ItemFlagUpdate {
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

export interface ItemOverrideRow {
  id: string;
  article_id: string;
  override_type: ItemOverrideType | null;
  previous_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  reason: string | null;
  created_by: string;
  created_at: string;
}

export interface ItemOverrideInsert {
  id?: string;
  article_id: string;
  override_type?: ItemOverrideType | null;
  previous_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  reason?: string | null;
  created_by: string;
  created_at?: string;
}

export interface ItemOverrideUpdate {
  id?: string;
  article_id?: string;
  override_type?: ItemOverrideType | null;
  previous_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  reason?: string | null;
  created_by?: string;
  created_at?: string;
}

export interface ScheduleRow {
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

export interface ScheduleInsert {
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

export interface ScheduleUpdate {
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

export interface AlertRecipientRow {
  id: string;
  schedule_id: string | null;
  email: string;
  name: string | null;
  is_active: boolean;
  alert_types: string[] | null;
  created_at: string;
}

export interface AlertRecipientInsert {
  id?: string;
  schedule_id?: string | null;
  email: string;
  name?: string | null;
  is_active?: boolean;
  alert_types?: string[] | null;
  created_at?: string;
}

export interface AlertRecipientUpdate {
  id?: string;
  schedule_id?: string | null;
  email?: string;
  name?: string | null;
  is_active?: boolean;
  alert_types?: string[] | null;
  created_at?: string;
}

export interface DigestRunRow {
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

export interface DigestRunInsert {
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

export interface DigestRunUpdate {
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

export interface DigestItemRow {
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

export interface DigestItemInsert {
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

export interface DigestItemUpdate {
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

export interface AttachmentRow {
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

export interface AttachmentInsert {
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

export interface AttachmentUpdate {
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

export interface AuditLogRow {
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

export interface AuditLogInsert {
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

export interface AuditLogUpdate {
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
      };
      disease_states: {
        Row: DiseaseStateRow;
        Insert: DiseaseStateInsert;
        Update: DiseaseStateUpdate;
      };
      entities: {
        Row: EntityRow;
        Insert: EntityInsert;
        Update: EntityUpdate;
      };
      entity_aliases: {
        Row: EntityAliasRow;
        Insert: EntityAliasInsert;
        Update: EntityAliasUpdate;
      };
      entity_disease_states: {
        Row: EntityDiseaseStateRow;
        Insert: EntityDiseaseStateInsert;
        Update: EntityDiseaseStateUpdate;
      };
      sections: {
        Row: SectionRow;
        Insert: SectionInsert;
        Update: SectionUpdate;
      };
      subsections: {
        Row: SubsectionRow;
        Insert: SubsectionInsert;
        Update: SubsectionUpdate;
      };
      outlets: {
        Row: OutletRow;
        Insert: OutletInsert;
        Update: OutletUpdate;
      };
      outlet_lists: {
        Row: OutletListRow;
        Insert: OutletListInsert;
        Update: OutletListUpdate;
      };
      outlet_list_members: {
        Row: OutletListMemberRow;
        Insert: OutletListMemberInsert;
        Update: OutletListMemberUpdate;
      };
      source_adapters: {
        Row: SourceAdapterRow;
        Insert: SourceAdapterInsert;
        Update: SourceAdapterUpdate;
      };
      ingestion_runs: {
        Row: IngestionRunRow;
        Insert: IngestionRunInsert;
        Update: IngestionRunUpdate;
      };
      articles: {
        Row: ArticleRow;
        Insert: ArticleInsert;
        Update: ArticleUpdate;
      };
      story_clusters: {
        Row: StoryClusterRow;
        Insert: StoryClusterInsert;
        Update: StoryClusterUpdate;
      };
      article_entities: {
        Row: ArticleEntityRow;
        Insert: ArticleEntityInsert;
        Update: ArticleEntityUpdate;
      };
      article_sections: {
        Row: ArticleSectionRow;
        Insert: ArticleSectionInsert;
        Update: ArticleSectionUpdate;
      };
      rules: {
        Row: RuleRow;
        Insert: RuleInsert;
        Update: RuleUpdate;
      };
      rule_conditions: {
        Row: RuleConditionRow;
        Insert: RuleConditionInsert;
        Update: RuleConditionUpdate;
      };
      rule_actions: {
        Row: RuleActionRow;
        Insert: RuleActionInsert;
        Update: RuleActionUpdate;
      };
      item_flags: {
        Row: ItemFlagRow;
        Insert: ItemFlagInsert;
        Update: ItemFlagUpdate;
      };
      item_overrides: {
        Row: ItemOverrideRow;
        Insert: ItemOverrideInsert;
        Update: ItemOverrideUpdate;
      };
      schedules: {
        Row: ScheduleRow;
        Insert: ScheduleInsert;
        Update: ScheduleUpdate;
      };
      alert_recipients: {
        Row: AlertRecipientRow;
        Insert: AlertRecipientInsert;
        Update: AlertRecipientUpdate;
      };
      digest_runs: {
        Row: DigestRunRow;
        Insert: DigestRunInsert;
        Update: DigestRunUpdate;
      };
      digest_items: {
        Row: DigestItemRow;
        Insert: DigestItemInsert;
        Update: DigestItemUpdate;
      };
      attachments: {
        Row: AttachmentRow;
        Insert: AttachmentInsert;
        Update: AttachmentUpdate;
      };
      audit_log: {
        Row: AuditLogRow;
        Insert: AuditLogInsert;
        Update: AuditLogUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
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
