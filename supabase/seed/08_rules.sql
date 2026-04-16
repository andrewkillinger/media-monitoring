-- Seed: Classification Rules
-- UUID prefix: e0000000-0000-0000-0000-... for rules
--              e1000000-0000-0000-0000-... for rule_conditions
--              e2000000-0000-0000-0000-... for rule_actions
--
-- rule_type values:  inclusion | exclusion | assignment | alert | tagging
-- match_mode values: all | any
-- condition_field:   title | body | full_text | outlet | outlet_list | entity | product
--                    disease_state | region | language | media_type | tag | author | sentiment
-- condition_operator: contains | not_contains | matches_regex | in_list | not_in_list
--                     equals | not_equals | exists | not_exists
-- action_type:       assign_section | assign_subsection | add_tag | set_priority
--                    trigger_alert | exclude | flag_review | set_sentiment
--
-- Key UUIDs referenced (from existing seed files):
--   Sections:
--     c0000000-...-000000000002  Acadia Corporate and Product News
--     c0000000-...-000000000003  Rett Syndrome
--     c0000000-...-000000000004  Parkinson's Disease
--     c0000000-...-000000000005  Schizophrenia
--     c0000000-...-000000000006  Prader-Willi Syndrome
--     c0000000-...-000000000007  Alzheimer's Disease
--     c0000000-...-000000000008  Fragile X Syndrome
--     c0000000-...-000000000009  News of Interest
--   Subsections (section -> therapeutic/competitor):
--     c1000000-...-000000000001  Rett -> Therapeutic
--     c1000000-...-000000000002  Rett -> Competitor
--     c1000000-...-000000000003  Parkinson's -> Therapeutic
--     c1000000-...-000000000004  Parkinson's -> Competitor
--     c1000000-...-000000000005  Schizophrenia -> Therapeutic
--     c1000000-...-000000000006  Schizophrenia -> Competitor
--     c1000000-...-000000000007  Prader-Willi -> Therapeutic
--     c1000000-...-000000000008  Prader-Willi -> Competitor
--     c1000000-...-000000000009  Alzheimer's -> Therapeutic
--     c1000000-...-000000000010  Alzheimer's -> Competitor
--     c1000000-...-000000000011  Fragile X -> Therapeutic
--     c1000000-...-000000000012  Fragile X -> Competitor
--   Entities:
--     a0000000-...-000000000001  Acadia Pharmaceuticals
--     a2000000-...-000000000001  NUPLAZID
--     a2000000-...-000000000002  DAYBUE
--   Disease states:
--     b0000000-...-000000000001  rett-syndrome
--     b0000000-...-000000000002  parkinsons-disease
--     b0000000-...-000000000003  alzheimers-disease
--     b0000000-...-000000000004  schizophrenia
--     b0000000-...-000000000005  prader-willi-syndrome
--     b0000000-...-000000000006  fragile-x-syndrome
--   Outlet lists:
--     d1000000-...-000000000001  canada-priority
--     d1000000-...-000000000003  us-tier-1
--     d1000000-...-000000000006  academic-journals-exclude

-- ============================================================
-- RULES
-- ============================================================
INSERT INTO rules (id, name, description, priority, is_active, rule_type, match_mode) VALUES

-- Exclusion rules (run first - lowest priority numbers = highest precedence)
('e0000000-0000-0000-0000-000000000001',
 'Exclude Journal Publications',
 'Exclude articles originating from academic or peer-reviewed journal outlets.',
 10, true, 'exclusion', 'all'),

('e0000000-0000-0000-0000-000000000003',
 'Financial Without Product Mentions',
 'Exclude financial/earnings articles that do not mention any Acadia product by name.',
 15, true, 'exclusion', 'all'),

('e0000000-0000-0000-0000-000000000008',
 'Parkinson''s Exclude Movement Only',
 'Exclude articles mentioning Parkinson''s in a movement-disorder context that have no Acadia/product relevance.',
 20, true, 'exclusion', 'all'),

('e0000000-0000-0000-0000-000000000020',
 'Exclude Retweets',
 'Exclude social media items that are retweets (start with "RT @").',
 25, true, 'exclusion', 'all'),

('e0000000-0000-0000-0000-000000000021',
 'Exclude Sponsored Content',
 'Exclude items identified as sponsored, paid promotion, or advertorial.',
 30, true, 'exclusion', 'all'),

-- Assignment rules
('e0000000-0000-0000-0000-000000000002',
 'Acadia Corporate Mention',
 'Route articles mentioning Acadia Pharmaceuticals directly to the Acadia Corporate section.',
 50, true, 'assignment', 'all'),

('e0000000-0000-0000-0000-000000000022',
 'Social Acadia Mention',
 'Route social media items mentioning Acadia to the Acadia Corporate section.',
 55, true, 'assignment', 'all'),

('e0000000-0000-0000-0000-000000000004',
 'Rett Syndrome Therapeutic',
 'Route Rett syndrome articles without competitor entity to the Therapeutic subsection.',
 60, true, 'assignment', 'all'),

('e0000000-0000-0000-0000-000000000005',
 'Rett Syndrome Competitor',
 'Route Rett syndrome articles mentioning a competitor entity to the Competitor subsection.',
 60, true, 'assignment', 'all'),

('e0000000-0000-0000-0000-000000000006',
 'Parkinson''s Therapeutic',
 'Route Parkinson''s disease articles without competitor entity to the Therapeutic subsection.',
 70, true, 'assignment', 'all'),

('e0000000-0000-0000-0000-000000000007',
 'Parkinson''s Competitor',
 'Route Parkinson''s disease articles mentioning a competitor entity to the Competitor subsection.',
 70, true, 'assignment', 'all'),

('e0000000-0000-0000-0000-000000000009',
 'Alzheimer''s Therapeutic',
 'Route Alzheimer''s disease articles without competitor entity to the Therapeutic subsection.',
 80, true, 'assignment', 'all'),

('e0000000-0000-0000-0000-000000000010',
 'Alzheimer''s Competitor',
 'Route Alzheimer''s disease articles mentioning a competitor entity to the Competitor subsection.',
 80, true, 'assignment', 'all'),

('e0000000-0000-0000-0000-000000000011',
 'Schizophrenia Therapeutic',
 'Route schizophrenia articles without competitor entity to the Therapeutic subsection.',
 90, true, 'assignment', 'all'),

('e0000000-0000-0000-0000-000000000012',
 'Schizophrenia Competitor',
 'Route schizophrenia articles mentioning a competitor entity to the Competitor subsection.',
 90, true, 'assignment', 'all'),

('e0000000-0000-0000-0000-000000000013',
 'Prader-Willi Therapeutic',
 'Route Prader-Willi syndrome articles without competitor entity to the Therapeutic subsection.',
 100, true, 'assignment', 'all'),

('e0000000-0000-0000-0000-000000000014',
 'Prader-Willi Competitor',
 'Route Prader-Willi syndrome articles mentioning a competitor entity to the Competitor subsection.',
 100, true, 'assignment', 'all'),

('e0000000-0000-0000-0000-000000000015',
 'Fragile X Therapeutic',
 'Route Fragile X syndrome articles without competitor entity to the Therapeutic subsection.',
 110, true, 'assignment', 'all'),

('e0000000-0000-0000-0000-000000000016',
 'Fragile X Competitor',
 'Route Fragile X syndrome articles mentioning a competitor entity to the Competitor subsection.',
 110, true, 'assignment', 'all'),

('e0000000-0000-0000-0000-000000000017',
 'News of Interest',
 'Route articles from tier-1 outlets not already assigned to an Acadia entity section into News of Interest.',
 200, true, 'assignment', 'all'),

-- Alert rules
('e0000000-0000-0000-0000-000000000018',
 'Tier 1 Acadia - High Priority Alert',
 'Trigger a high-priority alert when a tier-1 outlet article mentions Acadia.',
 50, true, 'alert', 'all'),

('e0000000-0000-0000-0000-000000000019',
 'Negative Product Commentary',
 'Trigger a high-severity alert when an article contains negative product commentary keywords.',
 40, true, 'alert', 'all')

ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RULE CONDITIONS
-- ============================================================

-- ---- Rule 1: Exclude Journal Publications ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000001',
 'e0000000-0000-0000-0000-000000000001',
 'outlet_list', 'in_list', 'd1000000-0000-0000-0000-000000000006',
 false, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 2: Acadia Corporate Mention ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000002',
 'e0000000-0000-0000-0000-000000000002',
 'entity', 'equals', 'a0000000-0000-0000-0000-000000000001',
 false, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 3: Financial Without Product Mentions ----
-- Condition group 0 (all): title/body contains financial keyword
-- Condition group 1 (any): does NOT contain NUPLAZID or DAYBUE
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000003',
 'e0000000-0000-0000-0000-000000000003',
 'full_text', 'contains', 'earnings|revenue|quarterly results|financial results|guidance|EPS|stock price|share price|analyst|FDA approval',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000004',
 'e0000000-0000-0000-0000-000000000003',
 'entity', 'equals', 'a2000000-0000-0000-0000-000000000001',
 true, 1, 'any'),
('e1000000-0000-0000-0000-000000000005',
 'e0000000-0000-0000-0000-000000000003',
 'entity', 'equals', 'a2000000-0000-0000-0000-000000000002',
 true, 1, 'any')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 4: Rett Syndrome Therapeutic ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000006',
 'e0000000-0000-0000-0000-000000000004',
 'disease_state', 'equals', 'b0000000-0000-0000-0000-000000000001',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000007',
 'e0000000-0000-0000-0000-000000000004',
 'entity', 'exists', 'is_competitor:true',
 true, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 5: Rett Syndrome Competitor ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000008',
 'e0000000-0000-0000-0000-000000000005',
 'disease_state', 'equals', 'b0000000-0000-0000-0000-000000000001',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000009',
 'e0000000-0000-0000-0000-000000000005',
 'entity', 'exists', 'is_competitor:true',
 false, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 6: Parkinson's Therapeutic ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000010',
 'e0000000-0000-0000-0000-000000000006',
 'disease_state', 'equals', 'b0000000-0000-0000-0000-000000000002',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000011',
 'e0000000-0000-0000-0000-000000000006',
 'entity', 'exists', 'is_competitor:true',
 true, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 7: Parkinson's Competitor ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000012',
 'e0000000-0000-0000-0000-000000000007',
 'disease_state', 'equals', 'b0000000-0000-0000-0000-000000000002',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000013',
 'e0000000-0000-0000-0000-000000000007',
 'entity', 'exists', 'is_competitor:true',
 false, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 8: Parkinson's Exclude Movement Only ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000014',
 'e0000000-0000-0000-0000-000000000008',
 'disease_state', 'equals', 'b0000000-0000-0000-0000-000000000002',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000015',
 'e0000000-0000-0000-0000-000000000008',
 'full_text', 'contains', 'movement disorder',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000016',
 'e0000000-0000-0000-0000-000000000008',
 'entity', 'equals', 'a0000000-0000-0000-0000-000000000001',
 true, 0, 'all'),
('e1000000-0000-0000-0000-000000000017',
 'e0000000-0000-0000-0000-000000000008',
 'entity', 'equals', 'a2000000-0000-0000-0000-000000000001',
 true, 0, 'all'),
('e1000000-0000-0000-0000-000000000018',
 'e0000000-0000-0000-0000-000000000008',
 'entity', 'equals', 'a2000000-0000-0000-0000-000000000002',
 true, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 9: Alzheimer's Therapeutic ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000019',
 'e0000000-0000-0000-0000-000000000009',
 'disease_state', 'equals', 'b0000000-0000-0000-0000-000000000003',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000020',
 'e0000000-0000-0000-0000-000000000009',
 'entity', 'exists', 'is_competitor:true',
 true, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 10: Alzheimer's Competitor ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000021',
 'e0000000-0000-0000-0000-000000000010',
 'disease_state', 'equals', 'b0000000-0000-0000-0000-000000000003',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000022',
 'e0000000-0000-0000-0000-000000000010',
 'entity', 'exists', 'is_competitor:true',
 false, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 11: Schizophrenia Therapeutic ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000023',
 'e0000000-0000-0000-0000-000000000011',
 'disease_state', 'equals', 'b0000000-0000-0000-0000-000000000004',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000024',
 'e0000000-0000-0000-0000-000000000011',
 'entity', 'exists', 'is_competitor:true',
 true, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 12: Schizophrenia Competitor ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000025',
 'e0000000-0000-0000-0000-000000000012',
 'disease_state', 'equals', 'b0000000-0000-0000-0000-000000000004',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000026',
 'e0000000-0000-0000-0000-000000000012',
 'entity', 'exists', 'is_competitor:true',
 false, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 13: Prader-Willi Therapeutic ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000027',
 'e0000000-0000-0000-0000-000000000013',
 'disease_state', 'equals', 'b0000000-0000-0000-0000-000000000005',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000028',
 'e0000000-0000-0000-0000-000000000013',
 'entity', 'exists', 'is_competitor:true',
 true, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 14: Prader-Willi Competitor ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000029',
 'e0000000-0000-0000-0000-000000000014',
 'disease_state', 'equals', 'b0000000-0000-0000-0000-000000000005',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000030',
 'e0000000-0000-0000-0000-000000000014',
 'entity', 'exists', 'is_competitor:true',
 false, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 15: Fragile X Therapeutic ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000031',
 'e0000000-0000-0000-0000-000000000015',
 'disease_state', 'equals', 'b0000000-0000-0000-0000-000000000006',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000032',
 'e0000000-0000-0000-0000-000000000015',
 'entity', 'exists', 'is_competitor:true',
 true, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 16: Fragile X Competitor ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000033',
 'e0000000-0000-0000-0000-000000000016',
 'disease_state', 'equals', 'b0000000-0000-0000-0000-000000000006',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000034',
 'e0000000-0000-0000-0000-000000000016',
 'entity', 'exists', 'is_competitor:true',
 false, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 17: News of Interest ----
-- From tier-1 outlet list AND not the Acadia corporate entity
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000035',
 'e0000000-0000-0000-0000-000000000017',
 'outlet_list', 'in_list', 'd1000000-0000-0000-0000-000000000003',
 false, 0, 'any'),
('e1000000-0000-0000-0000-000000000036',
 'e0000000-0000-0000-0000-000000000017',
 'outlet_list', 'in_list', 'd1000000-0000-0000-0000-000000000001',
 false, 0, 'any'),
('e1000000-0000-0000-0000-000000000037',
 'e0000000-0000-0000-0000-000000000017',
 'entity', 'equals', 'a0000000-0000-0000-0000-000000000001',
 true, 1, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 18: Tier 1 Acadia - High Priority Alert ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000038',
 'e0000000-0000-0000-0000-000000000018',
 'outlet_list', 'in_list', 'd1000000-0000-0000-0000-000000000003',
 false, 0, 'any'),
('e1000000-0000-0000-0000-000000000039',
 'e0000000-0000-0000-0000-000000000018',
 'outlet_list', 'in_list', 'd1000000-0000-0000-0000-000000000001',
 false, 0, 'any'),
('e1000000-0000-0000-0000-000000000040',
 'e0000000-0000-0000-0000-000000000018',
 'entity', 'equals', 'a0000000-0000-0000-0000-000000000001',
 false, 1, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 19: Negative Product Commentary ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000041',
 'e0000000-0000-0000-0000-000000000019',
 'full_text', 'contains', 'dangerous|serious side effects|FDA warning|black box|safety concern|adverse event|recall|lawsuit|pulled from market|death|fatality|contraindicated',
 false, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 20: Exclude Retweets ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000042',
 'e0000000-0000-0000-0000-000000000020',
 'media_type', 'equals', 'social',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000043',
 'e0000000-0000-0000-0000-000000000020',
 'full_text', 'matches_regex', '^RT @',
 false, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 21: Exclude Sponsored Content ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000044',
 'e0000000-0000-0000-0000-000000000021',
 'full_text', 'contains', 'sponsored|paid promotion|advertorial',
 false, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 22: Social Acadia Mention ----
INSERT INTO rule_conditions (id, rule_id, field, operator, value, is_negated, group_id, group_mode) VALUES
('e1000000-0000-0000-0000-000000000045',
 'e0000000-0000-0000-0000-000000000022',
 'media_type', 'equals', 'social',
 false, 0, 'all'),
('e1000000-0000-0000-0000-000000000046',
 'e0000000-0000-0000-0000-000000000022',
 'entity', 'equals', 'a0000000-0000-0000-0000-000000000001',
 false, 0, 'all')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RULE ACTIONS
-- ============================================================

-- ---- Rule 1: Exclude Journal Publications ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000001',
 'e0000000-0000-0000-0000-000000000001',
 'exclude', NULL, NULL,
 '{"reason": "academic_journal"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 2: Acadia Corporate Mention ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000002',
 'e0000000-0000-0000-0000-000000000002',
 'assign_section', 'c0000000-0000-0000-0000-000000000002', NULL,
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 3: Financial Without Product Mentions ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000003',
 'e0000000-0000-0000-0000-000000000003',
 'exclude', NULL, NULL,
 '{"reason": "financial_no_product"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 4: Rett Syndrome Therapeutic ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000004',
 'e0000000-0000-0000-0000-000000000004',
 'assign_section', 'c0000000-0000-0000-0000-000000000003', NULL,
 '{}'::jsonb),
('e2000000-0000-0000-0000-000000000005',
 'e0000000-0000-0000-0000-000000000004',
 'assign_subsection', 'c1000000-0000-0000-0000-000000000001', NULL,
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 5: Rett Syndrome Competitor ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000006',
 'e0000000-0000-0000-0000-000000000005',
 'assign_section', 'c0000000-0000-0000-0000-000000000003', NULL,
 '{}'::jsonb),
('e2000000-0000-0000-0000-000000000007',
 'e0000000-0000-0000-0000-000000000005',
 'assign_subsection', 'c1000000-0000-0000-0000-000000000002', NULL,
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 6: Parkinson's Therapeutic ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000008',
 'e0000000-0000-0000-0000-000000000006',
 'assign_section', 'c0000000-0000-0000-0000-000000000004', NULL,
 '{}'::jsonb),
('e2000000-0000-0000-0000-000000000009',
 'e0000000-0000-0000-0000-000000000006',
 'assign_subsection', 'c1000000-0000-0000-0000-000000000003', NULL,
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 7: Parkinson's Competitor ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000010',
 'e0000000-0000-0000-0000-000000000007',
 'assign_section', 'c0000000-0000-0000-0000-000000000004', NULL,
 '{}'::jsonb),
('e2000000-0000-0000-0000-000000000011',
 'e0000000-0000-0000-0000-000000000007',
 'assign_subsection', 'c1000000-0000-0000-0000-000000000004', NULL,
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 8: Parkinson's Exclude Movement Only ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000012',
 'e0000000-0000-0000-0000-000000000008',
 'exclude', NULL, NULL,
 '{"reason": "parkinsons_movement_only"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 9: Alzheimer's Therapeutic ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000013',
 'e0000000-0000-0000-0000-000000000009',
 'assign_section', 'c0000000-0000-0000-0000-000000000007', NULL,
 '{}'::jsonb),
('e2000000-0000-0000-0000-000000000014',
 'e0000000-0000-0000-0000-000000000009',
 'assign_subsection', 'c1000000-0000-0000-0000-000000000009', NULL,
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 10: Alzheimer's Competitor ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000015',
 'e0000000-0000-0000-0000-000000000010',
 'assign_section', 'c0000000-0000-0000-0000-000000000007', NULL,
 '{}'::jsonb),
('e2000000-0000-0000-0000-000000000016',
 'e0000000-0000-0000-0000-000000000010',
 'assign_subsection', 'c1000000-0000-0000-0000-000000000010', NULL,
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 11: Schizophrenia Therapeutic ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000017',
 'e0000000-0000-0000-0000-000000000011',
 'assign_section', 'c0000000-0000-0000-0000-000000000005', NULL,
 '{}'::jsonb),
('e2000000-0000-0000-0000-000000000018',
 'e0000000-0000-0000-0000-000000000011',
 'assign_subsection', 'c1000000-0000-0000-0000-000000000005', NULL,
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 12: Schizophrenia Competitor ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000019',
 'e0000000-0000-0000-0000-000000000012',
 'assign_section', 'c0000000-0000-0000-0000-000000000005', NULL,
 '{}'::jsonb),
('e2000000-0000-0000-0000-000000000020',
 'e0000000-0000-0000-0000-000000000012',
 'assign_subsection', 'c1000000-0000-0000-0000-000000000006', NULL,
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 13: Prader-Willi Therapeutic ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000021',
 'e0000000-0000-0000-0000-000000000013',
 'assign_section', 'c0000000-0000-0000-0000-000000000006', NULL,
 '{}'::jsonb),
('e2000000-0000-0000-0000-000000000022',
 'e0000000-0000-0000-0000-000000000013',
 'assign_subsection', 'c1000000-0000-0000-0000-000000000007', NULL,
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 14: Prader-Willi Competitor ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000023',
 'e0000000-0000-0000-0000-000000000014',
 'assign_section', 'c0000000-0000-0000-0000-000000000006', NULL,
 '{}'::jsonb),
('e2000000-0000-0000-0000-000000000024',
 'e0000000-0000-0000-0000-000000000014',
 'assign_subsection', 'c1000000-0000-0000-0000-000000000008', NULL,
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 15: Fragile X Therapeutic ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000025',
 'e0000000-0000-0000-0000-000000000015',
 'assign_section', 'c0000000-0000-0000-0000-000000000008', NULL,
 '{}'::jsonb),
('e2000000-0000-0000-0000-000000000026',
 'e0000000-0000-0000-0000-000000000015',
 'assign_subsection', 'c1000000-0000-0000-0000-000000000011', NULL,
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 16: Fragile X Competitor ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000027',
 'e0000000-0000-0000-0000-000000000016',
 'assign_section', 'c0000000-0000-0000-0000-000000000008', NULL,
 '{}'::jsonb),
('e2000000-0000-0000-0000-000000000028',
 'e0000000-0000-0000-0000-000000000016',
 'assign_subsection', 'c1000000-0000-0000-0000-000000000012', NULL,
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 17: News of Interest ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000029',
 'e0000000-0000-0000-0000-000000000017',
 'assign_section', 'c0000000-0000-0000-0000-000000000009', NULL,
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 18: Tier 1 Acadia - High Priority Alert ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000030',
 'e0000000-0000-0000-0000-000000000018',
 'trigger_alert', NULL, NULL,
 '{"severity": "high", "channels": ["email", "slack"]}'::jsonb),
('e2000000-0000-0000-0000-000000000031',
 'e0000000-0000-0000-0000-000000000018',
 'set_priority', NULL, '90',
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 19: Negative Product Commentary ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000032',
 'e0000000-0000-0000-0000-000000000019',
 'trigger_alert', NULL, NULL,
 '{"severity": "critical", "channels": ["email", "slack", "sms"], "flag_type": "negative_product"}'::jsonb),
('e2000000-0000-0000-0000-000000000033',
 'e0000000-0000-0000-0000-000000000019',
 'flag_review', NULL, NULL,
 '{"flag_type": "negative_product", "severity": "critical"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 20: Exclude Retweets ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000034',
 'e0000000-0000-0000-0000-000000000020',
 'exclude', NULL, NULL,
 '{"reason": "retweet"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 21: Exclude Sponsored Content ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000035',
 'e0000000-0000-0000-0000-000000000021',
 'exclude', NULL, NULL,
 '{"reason": "sponsored_content"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---- Rule 22: Social Acadia Mention ----
INSERT INTO rule_actions (id, rule_id, action_type, target_id, target_value, metadata) VALUES
('e2000000-0000-0000-0000-000000000036',
 'e0000000-0000-0000-0000-000000000022',
 'assign_section', 'c0000000-0000-0000-0000-000000000002', NULL,
 '{}'::jsonb),
('e2000000-0000-0000-0000-000000000037',
 'e0000000-0000-0000-0000-000000000022',
 'assign_subsection', 'c1000000-0000-0000-0000-000000000022', NULL,
 '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
