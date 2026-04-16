-- Seed: Newsletter Sections and Subsections
-- UUID prefix: c0000000-0000-0000-0000-... for sections
--              c1000000-0000-0000-0000-... for subsections

-- ============================================================
-- SECTIONS
-- ============================================================
INSERT INTO sections (id, name, slug, description, display_order, is_active, is_default)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Overview / Summary',          'overview',                   'Daily summary and highlights across all monitored areas.',              10,  true,  true),
    ('c0000000-0000-0000-0000-000000000002', 'Acadia Corporate and Product News', 'acadia-corporate',     'News directly about Acadia Pharmaceuticals, its products, and pipeline.', 20, true,  false),
    ('c0000000-0000-0000-0000-000000000003', 'Rett Syndrome',               'rett-syndrome',              'Coverage of Rett syndrome research, treatment, and competitive landscape.',  30, true,  false),
    ('c0000000-0000-0000-0000-000000000004', 'Parkinson''s Disease',        'parkinsons-disease',         'Coverage of Parkinson''s disease treatment and competitive landscape.',      40, true,  false),
    ('c0000000-0000-0000-0000-000000000005', 'Schizophrenia',               'schizophrenia',              'Coverage of schizophrenia research, treatment, and competitive landscape.',  50, true,  false),
    ('c0000000-0000-0000-0000-000000000006', 'Prader-Willi Syndrome',       'prader-willi-syndrome',      'Coverage of Prader-Willi syndrome research and competitive landscape.',     60, true,  false),
    ('c0000000-0000-0000-0000-000000000007', 'Alzheimer''s Disease',        'alzheimers-disease',         'Coverage of Alzheimer''s disease research, treatment, and competitors.',    70, true,  false),
    ('c0000000-0000-0000-0000-000000000008', 'Fragile X Syndrome',          'fragile-x-syndrome',         'Coverage of Fragile X syndrome research and competitive landscape.',        80, true,  false),
    ('c0000000-0000-0000-0000-000000000009', 'News of Interest',            'news-of-interest',           'Broader pharma, regulatory, and healthcare policy news relevant to Acadia.', 90, true,  false),

    -- Optional / inactive sections
    ('c0000000-0000-0000-0000-000000000010', 'Lewy Body Dementia',          'lewy-body-dementia',         'Coverage of Lewy body dementia research and treatment.',                   100, false, false),
    ('c0000000-0000-0000-0000-000000000011', 'Essential Tremor',            'essential-tremor',           'Coverage of essential tremor research and competitive landscape.',         110, false, false),
    ('c0000000-0000-0000-0000-000000000012', 'Major Depressive Disorder',   'major-depressive-disorder',  'Coverage of major depressive disorder research and treatment.',            120, false, false),
    ('c0000000-0000-0000-0000-000000000013', 'Treatment-Resistant Depression','treatment-resistant-depression','Coverage of treatment-resistant depression research and treatment.',   130, false, false)

ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SUBSECTIONS for disease-state sections
-- Each disease-state section gets Competitor + Therapeutic subsections
-- ============================================================
INSERT INTO subsections (id, section_id, name, slug, display_order, is_active)
VALUES
    -- Rett Syndrome subsections
    ('c1000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'Therapeutic', 'therapeutic', 10, true),
    ('c1000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 'Competitor',  'competitor',  20, true),

    -- Parkinson's Disease subsections
    ('c1000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000004', 'Therapeutic', 'therapeutic', 10, true),
    ('c1000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'Competitor',  'competitor',  20, true),

    -- Schizophrenia subsections
    ('c1000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', 'Therapeutic', 'therapeutic', 10, true),
    ('c1000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000005', 'Competitor',  'competitor',  20, true),

    -- Prader-Willi Syndrome subsections
    ('c1000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000006', 'Therapeutic', 'therapeutic', 10, true),
    ('c1000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000006', 'Competitor',  'competitor',  20, true),

    -- Alzheimer's Disease subsections
    ('c1000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000007', 'Therapeutic', 'therapeutic', 10, true),
    ('c1000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000007', 'Competitor',  'competitor',  20, true),

    -- Fragile X Syndrome subsections
    ('c1000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000008', 'Therapeutic', 'therapeutic', 10, true),
    ('c1000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000008', 'Competitor',  'competitor',  20, true),

    -- Lewy Body Dementia subsections (inactive)
    ('c1000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000010', 'Therapeutic', 'therapeutic', 10, false),
    ('c1000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000010', 'Competitor',  'competitor',  20, false),

    -- Essential Tremor subsections (inactive)
    ('c1000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000011', 'Therapeutic', 'therapeutic', 10, false),
    ('c1000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000011', 'Competitor',  'competitor',  20, false),

    -- Major Depressive Disorder subsections (inactive)
    ('c1000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000012', 'Therapeutic', 'therapeutic', 10, false),
    ('c1000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000012', 'Competitor',  'competitor',  20, false),

    -- Treatment-Resistant Depression subsections (inactive)
    ('c1000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000013', 'Therapeutic', 'therapeutic', 10, false),
    ('c1000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000013', 'Competitor',  'competitor',  20, false),

    -- Acadia Corporate subsections
    ('c1000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000002', 'Traditional Media', 'traditional-media', 10, true),
    ('c1000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000002', 'Social / X',        'social-x',          20, true),
    ('c1000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000002', 'Financial',         'financial',         30, true)

ON CONFLICT (id) DO NOTHING;
