import { z } from "zod";

// ─── Shared primitives ────────────────────────────────────────────────────────

const uuidSchema = z.string().uuid();
const urlSchema = z.string().url("Must be a valid URL");
const isoDateSchema = z
  .string()
  .datetime({ message: "Must be a valid ISO 8601 datetime string" });

// ─── Article import schema ────────────────────────────────────────────────────

export const articleImportSchema = z.object({
  url: urlSchema,
  title: z.string().min(1, "Title is required").max(500),
  outletName: z.string().max(200).optional().nullable(),
  author: z.string().max(200).optional().nullable(),
  publishedAt: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .or(z.literal("")),
  bodySnippet: z.string().max(5000).optional().nullable(),
  language: z
    .string()
    .regex(/^[a-z]{2}(-[A-Z]{2})?$/, "Must be a BCP-47 language code (e.g. en, fr, en-US)")
    .default("en"),
  region: z.string().max(100).optional().nullable(),
  mediaType: z.string().max(50).optional().nullable(),
});

export type ArticleImportInput = z.infer<typeof articleImportSchema>;

// ─── Rule condition schema ────────────────────────────────────────────────────

const conditionFieldSchema = z.enum([
  "title",
  "body",
  "full_text",
  "outlet",
  "outlet_list",
  "entity",
  "product",
  "disease_state",
  "region",
  "language",
  "media_type",
  "tag",
  "author",
  "sentiment",
]);

const conditionOperatorSchema = z.enum([
  "contains",
  "not_contains",
  "matches_regex",
  "in_list",
  "not_in_list",
  "equals",
  "not_equals",
  "exists",
  "not_exists",
]);

const ruleConditionSchema = z.object({
  id: uuidSchema.optional(),
  field: conditionFieldSchema,
  operator: conditionOperatorSchema,
  value: z.string().min(0).max(1000),
  is_negated: z.boolean().default(false),
  group_id: z.number().int().min(0).default(0),
  group_mode: z.enum(["all", "any"]).default("all"),
});

// ─── Rule action schema ───────────────────────────────────────────────────────

const actionTypeSchema = z.enum([
  "assign_section",
  "assign_subsection",
  "add_tag",
  "set_priority",
  "trigger_alert",
  "exclude",
  "flag_review",
  "set_sentiment",
]);

const ruleActionSchema = z.object({
  id: uuidSchema.optional(),
  action_type: actionTypeSchema,
  target_id: uuidSchema.optional().nullable(),
  target_value: z.string().max(500).optional().nullable(),
  metadata: z.record(z.unknown()).default({}),
});

// ─── Rule schema ──────────────────────────────────────────────────────────────

export const ruleSchema = z.object({
  id: uuidSchema.optional(),
  name: z.string().min(1, "Rule name is required").max(200),
  description: z.string().max(1000).optional().nullable(),
  priority: z.number().int().min(0).max(9999).default(100),
  is_active: z.boolean().default(true),
  rule_type: z.enum(["inclusion", "exclusion", "assignment", "alert", "tagging"]),
  match_mode: z.enum(["all", "any"]).default("all"),
  conditions: z
    .array(ruleConditionSchema)
    .min(1, "At least one condition is required"),
  actions: z
    .array(ruleActionSchema)
    .min(1, "At least one action is required"),
});

export type RuleInput = z.infer<typeof ruleSchema>;

// ─── Entity schema ────────────────────────────────────────────────────────────

export const entitySchema = z.object({
  id: uuidSchema.optional(),
  name: z.string().min(1, "Entity name is required").max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .max(100),
  entity_type: z.enum(["company", "organization", "product", "molecule", "person"]),
  is_primary: z.boolean().default(false),
  is_competitor: z.boolean().default(false),
  parent_entity_id: uuidSchema.optional().nullable(),
  metadata: z.record(z.unknown()).default({}),
  is_active: z.boolean().default(true),
  aliases: z
    .array(
      z.object({
        alias_text: z.string().min(1).max(300),
        is_primary: z.boolean().default(false),
      })
    )
    .default([]),
});

export type EntityInput = z.infer<typeof entitySchema>;

// ─── Outlet schema ────────────────────────────────────────────────────────────

export const outletSchema = z.object({
  id: uuidSchema.optional(),
  name: z.string().min(1, "Outlet name is required").max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .max(100),
  tier: z
    .enum(["tier1", "tier2", "tier3", "trade", "local", "social", "other"])
    .default("other"),
  channel: z
    .enum(["print", "online", "broadcast", "social", "wire"])
    .default("online"),
  url: urlSchema.optional().nullable(),
  region: z.string().max(100).optional().nullable(),
  country: z.string().max(10).optional().nullable(),
  language: z.string().default("en"),
  is_priority: z.boolean().default(false),
  is_excluded: z.boolean().default(false),
  metadata: z.record(z.unknown()).default({}),
});

export type OutletInput = z.infer<typeof outletSchema>;

// ─── Section schema ───────────────────────────────────────────────────────────

export const sectionSchema = z.object({
  id: uuidSchema.optional(),
  name: z.string().min(1, "Section name is required").max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .max(100),
  description: z.string().max(500).optional().nullable(),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  is_default: z.boolean().default(false),
  subsections: z
    .array(
      z.object({
        id: uuidSchema.optional(),
        name: z.string().min(1).max(200),
        slug: z
          .string()
          .regex(/^[a-z0-9-]+$/)
          .max(100),
        display_order: z.number().int().min(0).default(0),
        is_active: z.boolean().default(true),
      })
    )
    .default([]),
});

export type SectionInput = z.infer<typeof sectionSchema>;

// ─── Digest config schema ─────────────────────────────────────────────────────

export const digestConfigSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  sectionOrder: z.array(uuidSchema).optional(),
  includeStatuses: z
    .array(z.enum(["classified", "reviewed", "published", "pending"]))
    .default(["classified", "reviewed", "published"]),
  maxItemsPerSection: z.number().int().min(0).default(0),
  includeEmptySections: z.boolean().default(true),
  coverageStart: isoDateSchema.optional(),
  coverageEnd: isoDateSchema.optional(),
}).refine(
  (data) => {
    if (data.coverageStart && data.coverageEnd) {
      return new Date(data.coverageStart) < new Date(data.coverageEnd);
    }
    return true;
  },
  { message: "coverageStart must be before coverageEnd" }
);

export type DigestConfigInput = z.infer<typeof digestConfigSchema>;

// ─── Source adapter schema ────────────────────────────────────────────────────

export const sourceAdapterSchema = z.object({
  id: uuidSchema.optional(),
  name: z.string().min(1, "Adapter name is required").max(200),
  adapter_type: z.enum([
    "rss",
    "google_news",
    "manual_url",
    "csv_import",
    "json_import",
    "twitter_manual",
    "file_upload",
    "meltwater",
    "factiva",
    "talkwalker",
    "tveyes",
    "webhook",
  ]),
  settings: z.record(z.unknown()).default({}),
  is_active: z.boolean().default(true),
  fetch_interval_minutes: z.number().int().min(1).max(10080).default(60),
});

export type SourceAdapterInput = z.infer<typeof sourceAdapterSchema>;

// ─── Twitter / X post schema ──────────────────────────────────────────────────

export const twitterPostSchema = z.object({
  url: urlSchema,
  authorHandle: z
    .string()
    .min(1)
    .max(50)
    .regex(/^@?[A-Za-z0-9_]+$/, "Invalid Twitter handle"),
  displayName: z.string().max(100).optional().nullable(),
  followerCount: z.number().int().min(0).optional().nullable(),
  text: z
    .string()
    .min(1, "Tweet text is required")
    .max(4000, "Tweet text is too long"),
  publishedAt: isoDateSchema.optional().nullable().or(z.literal("")),
  language: z
    .string()
    .regex(/^[a-z]{2}(-[A-Z]{2})?$/)
    .default("en"),
  region: z.string().max(100).optional().nullable(),
  engagementMetrics: z
    .object({
      likes: z.number().int().min(0).optional(),
      retweets: z.number().int().min(0).optional(),
      replies: z.number().int().min(0).optional(),
      views: z.number().int().min(0).optional(),
      bookmarks: z.number().int().min(0).optional(),
    })
    .optional()
    .nullable(),
});

export type TwitterPostInput = z.infer<typeof twitterPostSchema>;
