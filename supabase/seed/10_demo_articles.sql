-- Seed: Demo Articles and Related Data
-- UUID prefix: f0000000-0000-0000-0000-... for articles

-- ============================================================
-- STORY CLUSTER (for syndicated pair)
-- ============================================================
INSERT INTO story_clusters (id, title, article_count) VALUES
('f9000000-0000-0000-0000-000000000001', 'Rett syndrome study highlights potential for personalized treatments', 2)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ARTICLES
-- ============================================================
INSERT INTO articles (id, url, title, title_normalized, outlet_id, outlet_name_raw, published_at, body_snippet, language, region, country, channel, status, review_status, priority_score, is_paywalled, fulltext_status, sentiment, metadata) VALUES

-- 1. Rett Syndrome / Therapeutic
('f0000000-0000-0000-0000-000000000001',
 'https://firstwordpharma.com/story/rett-personalized-treatments-2025',
 'Rett syndrome study highlights potential for personalized treatments',
 'rett syndrome study highlights potential for personalized treatments',
 'd0000000-0000-0000-0000-000000000039', 'FirstWord Pharma',
 '2025-04-15T10:30:00Z',
 'A new study published this week explores how mutations in the MECP2 gene affect individuals differently, opening the door to more personalized therapeutic approaches for Rett syndrome patients.',
 'en', 'us', 'US', 'online', 'published', 'approved', 65, false, 'public', 'neutral', '{}'::jsonb),

-- 2. Rett Syndrome / Therapeutic
('f0000000-0000-0000-0000-000000000002',
 'https://lifetechnology.com/mecp2-mutations-diverse-effects',
 'New Study Reveals Diverse Effects of MECP2 Mutations',
 'new study reveals diverse effects of mecp2 mutations',
 'd0000000-0000-0000-0000-000000000043', 'Life Technology',
 '2025-04-14T14:00:00Z',
 'Researchers have discovered that MECP2 mutations lead to a wider range of cellular effects than previously understood, with implications for Rett syndrome treatment strategies.',
 'en', 'us', 'US', 'online', 'published', 'approved', 55, false, 'public', 'neutral', '{}'::jsonb),

-- 3. Rett Syndrome / Therapeutic
('f0000000-0000-0000-0000-000000000003',
 'https://neurosciencenews.com/minibrains-rett-syndrome-paths',
 'Minibrains Reveal Personalized Paths for Rett Syndrome',
 'minibrains reveal personalized paths for rett syndrome',
 'd0000000-0000-0000-0000-000000000044', 'Neuroscience News',
 '2025-04-14T11:00:00Z',
 'Using brain organoids derived from patient stem cells, scientists have mapped distinct molecular pathways affected in individual Rett syndrome cases.',
 'en', 'us', 'US', 'online', 'published', 'approved', 60, false, 'public', 'positive', '{}'::jsonb),

-- 4. Parkinson''s / Competitor
('f0000000-0000-0000-0000-000000000004',
 'https://businessnj.com/amneal-parkinsons-donation-2025',
 'Amneal Pharmaceuticals donates $2M to support Parkinson''s disease patients',
 'amneal pharmaceuticals donates 2m to support parkinsons disease patients',
 'd0000000-0000-0000-0000-000000000045', 'Business in New Jersey Everyday',
 '2025-04-14T09:00:00Z',
 'Amneal Pharmaceuticals has pledged $2 million to support organizations serving Parkinson''s disease patients and their caregivers.',
 'en', 'us', 'US', 'online', 'published', 'approved', 45, false, 'public', 'positive', '{}'::jsonb),

-- 5. Parkinson''s / Therapeutic
('f0000000-0000-0000-0000-000000000005',
 'https://parkinson.org/diagnostic-tests-promise-2025',
 'Tests Show Promise for Diagnosing Parkinson''s and Dementia with Lewy Bodies',
 'tests show promise for diagnosing parkinsons and dementia with lewy bodies',
 'd0000000-0000-0000-0000-000000000046', 'Parkinson''s Foundation',
 '2025-04-14T15:30:00Z',
 'New diagnostic tests may enable earlier and more accurate diagnosis of Parkinson''s disease and dementia with Lewy bodies.',
 'en', 'us', 'US', 'online', 'published', 'approved', 50, false, 'public', 'positive', '{}'::jsonb),

-- 6. Alzheimer''s / Therapeutic
('f0000000-0000-0000-0000-000000000006',
 'https://medpagetoday.com/alzheimers-blood-tests-patients',
 'Alzheimer''s Blood Tests: Most Patients Are Not Afraid to Know',
 'alzheimers blood tests most patients are not afraid to know',
 'd0000000-0000-0000-0000-000000000037', 'MedPage Today',
 '2025-04-15T08:00:00Z',
 'A survey of patients undergoing Alzheimer''s blood testing found that the vast majority were not anxious about receiving their results.',
 'en', 'us', 'US', 'online', 'published', 'approved', 55, false, 'public', 'neutral', '{}'::jsonb),

-- 7. Essential Tremor / Competitor
('f0000000-0000-0000-0000-000000000007',
 'https://neurologyadvisor.com/ulixacaltamide-nda-essential-tremor',
 'Ulixacaltamide NDA Accepted for Essential Tremor; PDUFA Date Set',
 'ulixacaltamide nda accepted for essential tremor pdufa date set',
 'd0000000-0000-0000-0000-000000000038', 'Neurology Advisor',
 '2025-04-14T12:00:00Z',
 'The FDA has accepted the NDA for ulixacaltamide for the treatment of essential tremor, with a PDUFA target action date set.',
 'en', 'us', 'US', 'online', 'published', 'approved', 60, false, 'public', 'neutral', '{}'::jsonb),

-- 8. Essential Tremor / Competitor
('f0000000-0000-0000-0000-000000000008',
 'https://marketscreener.com/praxis-fda-nda-acceptance',
 'Praxis Precision Medicines Shares Rise After FDA Accepts New Drug Application',
 'praxis precision medicines shares rise after fda accepts new drug application',
 'd0000000-0000-0000-0000-000000000047', 'Market Screener',
 '2025-04-14T16:00:00Z',
 'Shares of Praxis Precision Medicines rose sharply following the FDA''s acceptance of the company''s NDA for essential tremor.',
 'en', 'us', 'US', 'online', 'published', 'approved', 50, false, 'public', 'positive', '{}'::jsonb),

-- 9. News of Interest
('f0000000-0000-0000-0000-000000000009',
 'https://statnews.com/novartis-ceo-anthropic-board',
 'Novartis CEO joins Anthropic''s board',
 'novartis ceo joins anthropics board',
 'd0000000-0000-0000-0000-000000000026', 'STAT News',
 '2025-04-15T07:00:00Z',
 'The CEO of Novartis has been appointed to the board of Anthropic, the AI company.',
 'en', 'us', 'US', 'online', 'published', 'approved', 70, false, 'public', 'neutral', '{}'::jsonb),

-- 10. News of Interest
('f0000000-0000-0000-0000-000000000010',
 'https://fiercehealthcare.com/dtc-drug-purchases-deductibles',
 'Bill would force payers to apply DTC drug purchases to patient deductibles',
 'bill would force payers to apply dtc drug purchases to patient deductibles',
 'd0000000-0000-0000-0000-000000000041', 'Fierce Healthcare',
 '2025-04-14T13:00:00Z',
 'Bipartisan legislation introduced in Congress would require insurers to count direct-to-consumer drug purchases toward patient deductibles.',
 'en', 'us', 'US', 'online', 'published', 'approved', 60, false, 'public', 'neutral', '{}'::jsonb),

-- 11. News of Interest
('f0000000-0000-0000-0000-000000000011',
 'https://statnews.com/congress-healthcare-agenda-spring-2025',
 'Congress returns to a packed health care agenda',
 'congress returns to a packed health care agenda',
 'd0000000-0000-0000-0000-000000000026', 'STAT News',
 '2025-04-14T06:30:00Z',
 'Lawmakers face a crowded health policy calendar including drug pricing, FDA reform, and rare disease legislation.',
 'en', 'us', 'US', 'online', 'published', 'approved', 55, false, 'public', 'neutral', '{}'::jsonb),

-- 12. News of Interest
('f0000000-0000-0000-0000-000000000012',
 'https://biospace.com/fda-bespoke-therapy-guidelines-2025',
 'FDA bolsters bespoke therapy framework with new draft safety guidelines',
 'fda bolsters bespoke therapy framework with new draft safety guidelines',
 'd0000000-0000-0000-0000-000000000040', 'BioSpace',
 '2025-04-14T10:00:00Z',
 'The FDA released new draft guidelines aimed at streamlining safety requirements for bespoke therapies.',
 'en', 'us', 'US', 'online', 'published', 'approved', 50, false, 'public', 'neutral', '{}'::jsonb),

-- 13. Syndicated duplicate of article 1
('f0000000-0000-0000-0000-000000000013',
 'https://yahoo.com/news/rett-syndrome-personalized-treatments',
 'Rett syndrome study highlights potential for personalized treatments',
 'rett syndrome study highlights potential for personalized treatments',
 NULL, 'Yahoo News',
 '2025-04-15T11:00:00Z',
 'A new study published this week explores how mutations in the MECP2 gene affect individuals differently.',
 'en', 'us', 'US', 'online', 'duplicate', NULL, 30, false, 'public', 'neutral', '{}'::jsonb),

-- 14. Social / Twitter item
('f0000000-0000-0000-0000-000000000014',
 'https://x.com/pharma_analyst/status/1234567890',
 'Acadia Pharmaceuticals reports strong Q1 2025 results with DAYBUE uptake exceeding expectations',
 'acadia pharmaceuticals reports strong q1 2025 results with daybue uptake exceeding expectations',
 NULL, 'X / Twitter',
 '2025-04-15T14:00:00Z',
 '@pharma_analyst: Acadia Pharmaceuticals reports strong Q1 2025 results with DAYBUE uptake exceeding expectations. $ACAD',
 'en', 'us', 'US', 'social', 'published', 'approved', 40, false, 'public', 'positive',
 '{"social_author_handle": "@pharma_analyst", "social_display_name": "Pharma Analyst", "social_follower_count": 12500, "social_engagement": {"likes": 45, "retweets": 12, "replies": 3}}'::jsonb),

-- 15. Excluded journal publication
('f0000000-0000-0000-0000-000000000015',
 'https://nature.com/articles/mecp2-folding-analysis',
 'MECP2 Protein Folding in Rett Syndrome: A Structural Analysis',
 'mecp2 protein folding in rett syndrome a structural analysis',
 NULL, 'Nature',
 '2025-04-13T09:00:00Z',
 'This study presents a comprehensive structural analysis of MECP2 protein folding patterns in Rett syndrome.',
 'en', 'us', 'US', 'online', 'excluded', NULL, 80, false, 'public', 'neutral',
 '{"exclusion_reason": "Journal publication excluded per editorial policy"}'::jsonb),

-- 16. Flagged negative product commentary
('f0000000-0000-0000-0000-000000000016',
 'https://reuters.com/business/healthcare/nuplazid-side-effects-concerns',
 'Patient groups raise concerns about NUPLAZID side effect reporting',
 'patient groups raise concerns about nuplazid side effect reporting',
 'd0000000-0000-0000-0000-000000000030', 'Reuters',
 '2025-04-15T16:00:00Z',
 'Several patient advocacy groups have raised concerns about the reporting and documentation of side effects associated with NUPLAZID.',
 'en', 'us', 'US', 'wire', 'reviewed', 'approved', 95, false, 'public', 'negative', '{}'::jsonb),

-- 17. Paywalled article
('f0000000-0000-0000-0000-000000000017',
 'https://wsj.com/business/acadia-rare-disease-strategy',
 'Inside Acadia''s Strategy for Rare Disease Dominance',
 'inside acadias strategy for rare disease dominance',
 'd0000000-0000-0000-0000-000000000033', 'The Wall Street Journal',
 '2025-04-14T08:00:00Z',
 'Acadia Pharmaceuticals is pursuing an aggressive strategy to dominate the rare disease market.',
 'en', 'us', 'US', 'print', 'reviewed', 'approved', 85, true, 'unavailable', 'positive', '{}'::jsonb),

-- 18. Item needing review
('f0000000-0000-0000-0000-000000000018',
 'https://endpointsnews.com/gene-therapy-rett-promise',
 'New gene therapy approach shows early promise for Rett syndrome',
 'new gene therapy approach shows early promise for rett syndrome',
 'd0000000-0000-0000-0000-000000000029', 'Endpoints News',
 '2025-04-15T12:00:00Z',
 'Early-stage results from a novel gene therapy approach for Rett syndrome show encouraging signs of efficacy.',
 'en', 'us', 'US', 'online', 'classified', 'needs_review', 70, false, 'public', 'positive', '{}'::jsonb),

-- 19. Broadcast mention
('f0000000-0000-0000-0000-000000000019',
 'https://cnbc.com/video/acadia-pipeline-discussion',
 'CNBC discusses Acadia Pharmaceuticals pipeline potential',
 'cnbc discusses acadia pharmaceuticals pipeline potential',
 'd0000000-0000-0000-0000-000000000036', 'CNBC',
 '2025-04-14T18:00:00Z',
 'CNBC analysts discussed the potential of Acadia Pharmaceuticals'' pipeline, highlighting DAYBUE growth and NUPLAZID stability.',
 'en', 'us', 'US', 'broadcast', 'published', 'approved', 75, false, 'public', 'positive', '{}'::jsonb),

-- 20. Canadian item
('f0000000-0000-0000-0000-000000000020',
 'https://theglobeandmail.com/health/rett-ontario-access',
 'Rett syndrome families in Ontario advocate for expanded access',
 'rett syndrome families in ontario advocate for expanded access',
 'd0000000-0000-0000-0000-000000000001', 'The Globe and Mail',
 '2025-04-13T11:00:00Z',
 'Families affected by Rett syndrome in Ontario are advocating for expanded access to emerging therapies.',
 'en', 'canada', 'CA', 'print', 'published', 'approved', 55, false, 'public', 'neutral', '{}'::jsonb)

ON CONFLICT (id) DO NOTHING;

-- Update cluster references for syndicated pair
UPDATE articles SET cluster_id = 'f9000000-0000-0000-0000-000000000001', is_cluster_primary = true
WHERE id = 'f0000000-0000-0000-0000-000000000001';
UPDATE articles SET cluster_id = 'f9000000-0000-0000-0000-000000000001', is_cluster_primary = false
WHERE id = 'f0000000-0000-0000-0000-000000000013';

-- ============================================================
-- ARTICLE SECTIONS
-- ============================================================
INSERT INTO article_sections (id, article_id, section_id, subsection_id) VALUES
-- Rett Syndrome / Therapeutic
('f1000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001'),
('f1000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001'),
('f1000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001'),
-- Parkinson''s / Competitor + Therapeutic
('f1000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004'),
('f1000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000003'),
-- Alzheimer''s / Therapeutic
('f1000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000009'),
-- Essential Tremor / Competitor
('f1000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000016'),
('f1000000-0000-0000-0000-000000000008', 'f0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000016'),
-- News of Interest
('f1000000-0000-0000-0000-000000000009', 'f0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000009', NULL),
('f1000000-0000-0000-0000-000000000010', 'f0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000009', NULL),
('f1000000-0000-0000-0000-000000000011', 'f0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000009', NULL),
('f1000000-0000-0000-0000-000000000012', 'f0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000009', NULL),
-- Social - Acadia Corporate
('f1000000-0000-0000-0000-000000000014', 'f0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000002', NULL),
-- Flagged - Acadia Corporate
('f1000000-0000-0000-0000-000000000016', 'f0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000002', NULL),
-- Paywalled - Acadia Corporate
('f1000000-0000-0000-0000-000000000017', 'f0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000002', NULL),
-- Needs review - Rett Syndrome
('f1000000-0000-0000-0000-000000000018', 'f0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001'),
-- Broadcast - Acadia Corporate
('f1000000-0000-0000-0000-000000000019', 'f0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000002', NULL),
-- Canadian Rett
('f1000000-0000-0000-0000-000000000020', 'f0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ARTICLE ENTITIES
-- ============================================================
INSERT INTO article_entities (id, article_id, entity_id, matched_alias, match_location, is_primary_mention) VALUES
('f2000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000001', 'Acadia Pharmaceuticals', 'title', true),
('f2000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000014', 'a2000000-0000-0000-0000-000000000002', 'DAYBUE', 'title', false),
('f2000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000016', 'a0000000-0000-0000-0000-000000000001', 'Acadia', 'body', false),
('f2000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000016', 'a2000000-0000-0000-0000-000000000001', 'NUPLAZID', 'title', true),
('f2000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000017', 'a0000000-0000-0000-0000-000000000001', 'Acadia', 'both', true),
('f2000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000019', 'a0000000-0000-0000-0000-000000000001', 'Acadia Pharmaceuticals', 'title', true),
('f2000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000019', 'a2000000-0000-0000-0000-000000000002', 'DAYBUE', 'body', false),
('f2000000-0000-0000-0000-000000000008', 'f0000000-0000-0000-0000-000000000019', 'a2000000-0000-0000-0000-000000000001', 'NUPLAZID', 'body', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ITEM FLAGS
-- ============================================================
INSERT INTO item_flags (id, article_id, flag_type, severity, status, title, notes, hold_from_newsletter) VALUES
('f3000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000016', 'negative_product', 'high', 'reviewing', 'Negative NUPLAZID coverage from Reuters', 'Patient groups raising safety concerns. Monitor for follow-up coverage.', true),
('f3000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000007', 'competitor_milestone', 'medium', 'sent', 'Essential Tremor NDA acceptance', 'Competitive intelligence: ulixacaltamide NDA accepted by FDA.', false)
ON CONFLICT (id) DO NOTHING;
