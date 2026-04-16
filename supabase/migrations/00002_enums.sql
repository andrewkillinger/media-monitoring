-- Create all application enum types

create type user_role as enum ('admin', 'editor', 'reviewer');

create type article_status as enum (
    'pending',
    'classified',
    'reviewed',
    'published',
    'excluded',
    'duplicate'
);

create type review_status as enum (
    'needs_review',
    'approved',
    'rejected',
    'reclassified'
);

create type rule_type as enum (
    'inclusion',
    'exclusion',
    'assignment',
    'alert',
    'tagging'
);

create type match_mode as enum ('all', 'any');

create type condition_field as enum (
    'title',
    'body',
    'full_text',
    'outlet',
    'outlet_list',
    'entity',
    'product',
    'disease_state',
    'region',
    'language',
    'media_type',
    'tag',
    'author',
    'sentiment'
);

create type condition_operator as enum (
    'contains',
    'not_contains',
    'matches_regex',
    'in_list',
    'not_in_list',
    'equals',
    'not_equals',
    'exists',
    'not_exists'
);

create type action_type as enum (
    'assign_section',
    'assign_subsection',
    'add_tag',
    'set_priority',
    'trigger_alert',
    'exclude',
    'flag_review',
    'set_sentiment'
);

create type source_type as enum (
    'rss',
    'google_news',
    'manual_url',
    'csv_import',
    'json_import',
    'twitter_manual',
    'file_upload',
    'meltwater',
    'factiva',
    'talkwalker',
    'tveyes',
    'webhook'
);

create type digest_status as enum (
    'draft',
    'generated',
    'reviewed',
    'sent',
    'archived'
);

create type outlet_tier as enum (
    'tier1',
    'tier2',
    'tier3',
    'trade',
    'local',
    'social',
    'other'
);

create type alert_severity as enum (
    'critical',
    'high',
    'medium',
    'low'
);

create type alert_status as enum (
    'new',
    'reviewing',
    'sent',
    'resolved',
    'corrected'
);

create type channel_type as enum (
    'print',
    'online',
    'broadcast',
    'social',
    'wire'
);

create type fulltext_status as enum (
    'public',
    'licensed',
    'uploaded',
    'unavailable'
);
