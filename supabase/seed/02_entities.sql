-- Seed: Entities (companies, products, molecules)
-- UUID prefix: a0000000-0000-0000-0000-... (Acadia primary)
--              a1000000-0000-0000-0000-... (other companies)
--              a2000000-0000-0000-0000-... (products)
--              a3000000-0000-0000-0000-... (molecules)

-- ============================================================
-- PRIMARY ENTITY: Acadia Pharmaceuticals
-- ============================================================
INSERT INTO entities (id, name, slug, entity_type, is_primary, is_competitor, parent_entity_id)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Acadia Pharmaceuticals', 'acadia-pharmaceuticals', 'company',  true,  false, NULL)
ON CONFLICT (id) DO NOTHING;

-- Acadia products / molecules
INSERT INTO entities (id, name, slug, entity_type, is_primary, is_competitor, parent_entity_id)
VALUES
    ('a2000000-0000-0000-0000-000000000001', 'NUPLAZID',    'nuplazid',    'product',  false, false, 'a0000000-0000-0000-0000-000000000001'),
    ('a3000000-0000-0000-0000-000000000001', 'pimavanserin', 'pimavanserin','molecule', false, false, 'a2000000-0000-0000-0000-000000000001'),
    ('a2000000-0000-0000-0000-000000000002', 'DAYBUE',      'daybue',      'product',  false, false, 'a0000000-0000-0000-0000-000000000001'),
    ('a3000000-0000-0000-0000-000000000002', 'trofinetide', 'trofinetide', 'molecule', false, false, 'a2000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PARKINSON'S DISEASE PSYCHOSIS COMPETITORS
-- ============================================================
INSERT INTO entities (id, name, slug, entity_type, is_primary, is_competitor, parent_entity_id)
VALUES
    -- Luye Pharmaceuticals
    ('a1000000-0000-0000-0000-000000000001', 'Luye Pharmaceuticals',   'luye-pharmaceuticals',  'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000003', 'Seroquel',               'seroquel',              'product',  false, true, 'a1000000-0000-0000-0000-000000000001'),
    ('a3000000-0000-0000-0000-000000000003', 'quetiapine',             'quetiapine',            'molecule', false, true, 'a2000000-0000-0000-0000-000000000003'),

    -- Sunovion Pharmaceuticals
    ('a1000000-0000-0000-0000-000000000002', 'Sunovion Pharmaceuticals','sunovion-pharmaceuticals','company', false, true, NULL),
    ('a2000000-0000-0000-0000-000000000004', 'Ulotaront',              'ulotaront',             'product',  false, true, 'a1000000-0000-0000-0000-000000000002'),
    ('a3000000-0000-0000-0000-000000000004', 'SEP-363856',             'sep-363856',            'molecule', false, true, 'a2000000-0000-0000-0000-000000000004'),

    -- Mayne Pharma Group
    ('a1000000-0000-0000-0000-000000000003', 'Mayne Pharma Group',     'mayne-pharma-group',    'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000005', 'Clozaril',               'clozaril',              'product',  false, true, 'a1000000-0000-0000-0000-000000000003'),
    ('a3000000-0000-0000-0000-000000000005', 'clozapine',              'clozapine',             'molecule', false, true, 'a2000000-0000-0000-0000-000000000005')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PARKINSON'S DISEASE (MOTOR) COMPETITORS
-- ============================================================
INSERT INTO entities (id, name, slug, entity_type, is_primary, is_competitor, parent_entity_id)
VALUES
    -- Adamas Pharmaceuticals
    ('a1000000-0000-0000-0000-000000000004', 'Adamas Pharmaceuticals', 'adamas-pharmaceuticals', 'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000006', 'GOCOVRI',                'gocovri',                'product',  false, true, 'a1000000-0000-0000-0000-000000000004'),
    ('a3000000-0000-0000-0000-000000000006', 'amantadine',             'amantadine',             'molecule', false, true, 'a2000000-0000-0000-0000-000000000006'),

    -- Acorda Therapeutics
    ('a1000000-0000-0000-0000-000000000005', 'Acorda Therapeutics',    'acorda-therapeutics',    'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000007', 'INBRIJA',                'inbrija',                'product',  false, true, 'a1000000-0000-0000-0000-000000000005'),
    ('a3000000-0000-0000-0000-000000000007', 'levodopa inhalation powder','levodopa-inhalation-powder','molecule',false,true,'a2000000-0000-0000-0000-000000000007'),

    -- Amneal Pharmaceuticals
    ('a1000000-0000-0000-0000-000000000006', 'Amneal Pharmaceuticals', 'amneal-pharmaceuticals', 'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000008', 'IPX203',                 'ipx203',                 'product',  false, true, 'a1000000-0000-0000-0000-000000000006'),
    ('a3000000-0000-0000-0000-000000000008', 'carbidopa/levodopa',     'carbidopa-levodopa',     'molecule', false, true, 'a2000000-0000-0000-0000-000000000008'),

    -- Alkahest, Inc.
    ('a1000000-0000-0000-0000-000000000007', 'Alkahest, Inc.',         'alkahest-inc',           'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000009', 'GRF6021',                'grf6021',                'product',  false, true, 'a1000000-0000-0000-0000-000000000007'),

    -- Minerva Neurosciences (also Schizophrenia)
    ('a1000000-0000-0000-0000-000000000008', 'Minerva Neurosciences',  'minerva-neurosciences',  'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000010', 'MIN-301',                'min-301',                'product',  false, true, 'a1000000-0000-0000-0000-000000000008')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ALZHEIMER'S DISEASE COMPETITORS
-- ============================================================
INSERT INTO entities (id, name, slug, entity_type, is_primary, is_competitor, parent_entity_id)
VALUES
    -- Biogen
    ('a1000000-0000-0000-0000-000000000009', 'Biogen',                 'biogen',                 'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000011', 'Aduhelm',                'aduhelm',                'product',  false, true, 'a1000000-0000-0000-0000-000000000009'),
    ('a3000000-0000-0000-0000-000000000009', 'aducanumab',             'aducanumab',             'molecule', false, true, 'a2000000-0000-0000-0000-000000000011'),

    -- Eisai
    ('a1000000-0000-0000-0000-000000000010', 'Eisai',                  'eisai',                  'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000012', 'Leqembi',                'leqembi',                'product',  false, true, 'a1000000-0000-0000-0000-000000000010'),
    ('a3000000-0000-0000-0000-000000000010', 'lecanemab',              'lecanemab',              'molecule', false, true, 'a2000000-0000-0000-0000-000000000012'),

    -- Bristol Myers Squibb (also Schizophrenia)
    ('a1000000-0000-0000-0000-000000000011', 'Bristol Myers Squibb',   'bristol-myers-squibb',   'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000013', 'KarXT',                  'karxt',                  'product',  false, true, 'a1000000-0000-0000-0000-000000000011'),
    ('a3000000-0000-0000-0000-000000000011', 'xanomeline-trospium',    'xanomeline-trospium',    'molecule', false, true, 'a2000000-0000-0000-0000-000000000013'),

    -- Karuna Therapeutics (also Schizophrenia; KarXT already inserted above)
    ('a1000000-0000-0000-0000-000000000012', 'Karuna Therapeutics',    'karuna-therapeutics',    'company',  false, true, NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SCHIZOPHRENIA-ONLY COMPETITORS
-- ============================================================
INSERT INTO entities (id, name, slug, entity_type, is_primary, is_competitor, parent_entity_id)
VALUES
    -- Alkermes plc
    ('a1000000-0000-0000-0000-000000000013', 'Alkermes plc',           'alkermes-plc',           'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000014', 'LYBALVI',                'lybalvi',                'product',  false, true, 'a1000000-0000-0000-0000-000000000013'),
    ('a3000000-0000-0000-0000-000000000012', 'olanzapine',             'olanzapine',             'molecule', false, true, 'a2000000-0000-0000-0000-000000000014'),
    ('a3000000-0000-0000-0000-000000000013', 'samidorphan',            'samidorphan',            'molecule', false, true, 'a2000000-0000-0000-0000-000000000014'),

    -- Otsuka Pharmaceuticals
    ('a1000000-0000-0000-0000-000000000014', 'Otsuka Pharmaceuticals', 'otsuka-pharmaceuticals', 'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000015', 'Rexulti',                'rexulti',                'product',  false, true, 'a1000000-0000-0000-0000-000000000014'),
    ('a3000000-0000-0000-0000-000000000014', 'brexpiprazole',          'brexpiprazole',          'molecule', false, true, 'a2000000-0000-0000-0000-000000000015'),

    -- Lundbeck (co-markets Rexulti with Otsuka; no separate product row needed)
    ('a1000000-0000-0000-0000-000000000015', 'Lundbeck',               'lundbeck',               'company',  false, true, NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SCHIZOPHRENIA NEGATIVE SYMPTOMS
-- ============================================================
INSERT INTO entities (id, name, slug, entity_type, is_primary, is_competitor, parent_entity_id)
VALUES
    -- Minerva Neurosciences MIN-101 / Roluperidone (company already inserted above)
    ('a2000000-0000-0000-0000-000000000016', 'Roluperidone',           'roluperidone',           'product',  false, true, 'a1000000-0000-0000-0000-000000000008'),
    ('a3000000-0000-0000-0000-000000000015', 'MIN-101',                'min-101',                'molecule', false, true, 'a2000000-0000-0000-0000-000000000016')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RETT SYNDROME COMPETITORS
-- ============================================================
INSERT INTO entities (id, name, slug, entity_type, is_primary, is_competitor, parent_entity_id)
VALUES
    -- Anavex Life Sciences
    ('a1000000-0000-0000-0000-000000000016', 'Anavex Life Sciences',   'anavex-life-sciences',   'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000017', 'ANAVEX2-73',             'anavex2-73',             'product',  false, true, 'a1000000-0000-0000-0000-000000000016'),
    ('a3000000-0000-0000-0000-000000000016', 'blarcamesine',           'blarcamesine',           'molecule', false, true, 'a2000000-0000-0000-0000-000000000017'),

    -- PharmaTher Holdings
    ('a1000000-0000-0000-0000-000000000017', 'PharmaTher Holdings',    'pharmatther-holdings',   'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000018', 'KETARX',                 'ketarx',                 'product',  false, true, 'a1000000-0000-0000-0000-000000000017'),
    ('a3000000-0000-0000-0000-000000000017', 'ketamine',               'ketamine',               'molecule', false, true, 'a2000000-0000-0000-0000-000000000018'),

    -- Unravel Biosciences
    ('a1000000-0000-0000-0000-000000000018', 'Unravel Biosciences',    'unravel-biosciences',    'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000019', 'RVL001',                 'rvl001',                 'product',  false, true, 'a1000000-0000-0000-0000-000000000018'),

    -- Neurotech International
    ('a1000000-0000-0000-0000-000000000019', 'Neurotech International','neurotech-international', 'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000020', 'NTI164',                 'nti164',                 'product',  false, true, 'a1000000-0000-0000-0000-000000000019'),

    -- Taysha Gene Therapies
    ('a1000000-0000-0000-0000-000000000020', 'Taysha Gene Therapies',  'taysha-gene-therapies',  'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000021', 'TSHA-102',               'tsha-102',               'product',  false, true, 'a1000000-0000-0000-0000-000000000020'),

    -- Neurogene, Inc.
    ('a1000000-0000-0000-0000-000000000021', 'Neurogene, Inc.',        'neurogene-inc',           'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000022', 'NGN-401',                'ngn-401',                'product',  false, true, 'a1000000-0000-0000-0000-000000000021'),

    -- Beam Therapeutics
    ('a1000000-0000-0000-0000-000000000022', 'Beam Therapeutics',      'beam-therapeutics',      'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000023', 'gene editing',           'gene-editing-beam',      'product',  false, true, 'a1000000-0000-0000-0000-000000000022'),

    -- Alcyone Therapeutics
    ('a1000000-0000-0000-0000-000000000023', 'Alcyone Therapeutics',   'alcyone-therapeutics',   'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000024', 'ACTX-101',               'actx-101',               'product',  false, true, 'a1000000-0000-0000-0000-000000000023'),

    -- Herophilus, Inc.
    ('a1000000-0000-0000-0000-000000000024', 'Herophilus, Inc.',       'herophilus-inc',          'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000025', 'HRP-12975',              'hrp-12975',              'product',  false, true, 'a1000000-0000-0000-0000-000000000024'),

    -- Vico Therapeutics
    ('a1000000-0000-0000-0000-000000000025', 'Vico Therapeutics',      'vico-therapeutics',      'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000026', 'RNA editing',            'rna-editing-vico',       'product',  false, true, 'a1000000-0000-0000-0000-000000000025'),

    -- Shape Therapeutics
    ('a1000000-0000-0000-0000-000000000026', 'Shape Therapeutics',     'shape-therapeutics',     'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000027', 'RNA editing',            'rna-editing-shape',      'product',  false, true, 'a1000000-0000-0000-0000-000000000026'),

    -- Wave Life Sciences
    ('a1000000-0000-0000-0000-000000000027', 'Wave Life Sciences',     'wave-life-sciences',     'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000028', 'RNA editing',            'rna-editing-wave',       'product',  false, true, 'a1000000-0000-0000-0000-000000000027'),

    -- Neuren Pharmaceuticals (also Prader-Willi)
    ('a1000000-0000-0000-0000-000000000028', 'Neuren Pharmaceuticals', 'neuren-pharmaceuticals', 'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000029', 'NNZ-2591',               'nnz-2591',               'product',  false, true, 'a1000000-0000-0000-0000-000000000028')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PRADER-WILLI SYNDROME COMPETITORS
-- ============================================================
INSERT INTO entities (id, name, slug, entity_type, is_primary, is_competitor, parent_entity_id)
VALUES
    -- Saniona
    ('a1000000-0000-0000-0000-000000000029', 'Saniona',                'saniona',                'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000030', 'Tesomet',                'tesomet',                'product',  false, true, 'a1000000-0000-0000-0000-000000000029'),

    -- Soleno Therapeutics
    ('a1000000-0000-0000-0000-000000000030', 'Soleno Therapeutics',    'soleno-therapeutics',    'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000031', 'DCCR',                   'dccr',                   'product',  false, true, 'a1000000-0000-0000-0000-000000000030'),
    ('a3000000-0000-0000-0000-000000000018', 'diazoxide choline controlled-release','diazoxide-choline-cr','molecule',false,true,'a2000000-0000-0000-0000-000000000031'),

    -- Novo Nordisk
    ('a1000000-0000-0000-0000-000000000031', 'Novo Nordisk',           'novo-nordisk',           'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000032', 'Saxenda',                'saxenda',                'product',  false, true, 'a1000000-0000-0000-0000-000000000031'),

    -- ConSynance Therapeutics
    ('a1000000-0000-0000-0000-000000000032', 'ConSynance Therapeutics','consonance-therapeutics', 'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000033', 'CSTI-500',               'csti-500',               'product',  false, true, 'a1000000-0000-0000-0000-000000000032'),

    -- Gideon Richter
    ('a1000000-0000-0000-0000-000000000033', 'Gideon Richter',         'gideon-richter',         'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000034', 'RGH-706',                'rgh-706',                'product',  false, true, 'a1000000-0000-0000-0000-000000000033'),

    -- Aardvark Therapeutics
    ('a1000000-0000-0000-0000-000000000034', 'Aardvark Therapeutics',  'aardvark-therapeutics',  'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000035', 'ARD-101',                'ard-101',                'product',  false, true, 'a1000000-0000-0000-0000-000000000034'),

    -- Harmony Biosciences
    ('a1000000-0000-0000-0000-000000000035', 'Harmony Biosciences',    'harmony-biosciences',    'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000036', 'pitolisant',             'pitolisant-product',     'product',  false, true, 'a1000000-0000-0000-0000-000000000035'),

    -- Tonix Pharmaceuticals
    ('a1000000-0000-0000-0000-000000000036', 'Tonix Pharmaceuticals',  'tonix-pharmaceuticals',  'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000037', 'TNX-2900',               'tnx-2900',               'product',  false, true, 'a1000000-0000-0000-0000-000000000036')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- FRAGILE X COMPETITORS
-- ============================================================
INSERT INTO entities (id, name, slug, entity_type, is_primary, is_competitor, parent_entity_id)
VALUES
    -- Zynerba
    ('a1000000-0000-0000-0000-000000000037', 'Zynerba',                'zynerba',                'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000038', 'Zygel',                  'zygel',                  'product',  false, true, 'a1000000-0000-0000-0000-000000000037'),

    -- Tetra Therapeutics
    ('a1000000-0000-0000-0000-000000000038', 'Tetra Therapeutics',     'tetra-therapeutics',     'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000039', 'Zatolmilast',            'zatolmilast',            'product',  false, true, 'a1000000-0000-0000-0000-000000000038'),

    -- Healx
    ('a1000000-0000-0000-0000-000000000039', 'Healx',                  'healx',                  'company',  false, true, NULL),
    ('a2000000-0000-0000-0000-000000000040', 'HLZ-0201',               'hlz-0201',               'product',  false, true, 'a1000000-0000-0000-0000-000000000039')
ON CONFLICT (id) DO NOTHING;
