-- Seed: Outlet Lists and Members
-- UUID prefix: d1000000-0000-0000-0000-... for outlet_lists

-- ============================================================
-- OUTLET LISTS
-- ============================================================
INSERT INTO outlet_lists (id, name, slug, description, list_type)
VALUES
    ('d1000000-0000-0000-0000-000000000001', 'Canada Priority',           'canada-priority',           'Top-tier English-language Canadian outlets requiring priority monitoring.',          'priority'),
    ('d1000000-0000-0000-0000-000000000002', 'French-language Canada',    'french-language-canada',    'French-language Canadian outlets for bilingual media monitoring.',                  'priority'),
    ('d1000000-0000-0000-0000-000000000003', 'US Tier 1',                 'us-tier-1',                 'Top-tier US general and pharma news outlets.',                                      'priority'),
    ('d1000000-0000-0000-0000-000000000004', 'US Trade Priority',         'us-trade-priority',         'Priority US pharmaceutical and biotech trade publications.',                        'priority'),
    ('d1000000-0000-0000-0000-000000000005', 'EU Priority',               'eu-priority',               'Priority European outlets for monitoring (placeholder for future expansion).',      'priority'),
    ('d1000000-0000-0000-0000-000000000006', 'Academic Journals Exclude', 'academic-journals-exclude', 'Academic and peer-reviewed journals to exclude from newsletter curation.',          'exclude')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- OUTLET LIST MEMBERS
-- ============================================================

-- Canada Priority
INSERT INTO outlet_list_members (outlet_list_id, outlet_id)
VALUES
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001'),  -- Globe and Mail
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002'),  -- Toronto Star
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003'),  -- National Post
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000004'),  -- Ottawa Citizen
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000005'),  -- Vancouver Sun
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000006'),  -- Montreal Gazette
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000007'),  -- Calgary Herald
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000008'),  -- Bloomberg Canada
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000009'),  -- Edmonton Journal
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000010'),  -- BNN Bloomberg
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000011'),  -- CBC TV and Radio
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000012'),  -- CTV News (national)
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000013'),  -- Newfoundland TV
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000014'),  -- CBC Toronto
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000015'),  -- CTV Toronto
    ('d1000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000016')   -- Global Toronto
ON CONFLICT DO NOTHING;

-- French-language Canada
INSERT INTO outlet_list_members (outlet_list_id, outlet_id)
VALUES
    ('d1000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000017'),  -- Le Devoir
    ('d1000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000018'),  -- La Presse
    ('d1000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000019'),  -- Le Journal de Québec
    ('d1000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000020'),  -- Le Journal de Montréal
    ('d1000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000021'),  -- Le Soleil
    ('d1000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000022'),  -- La Voix de L'Est
    ('d1000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000023'),  -- La Tribune
    ('d1000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000024'),  -- Journal Métro
    ('d1000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000025')   -- Le Droit
ON CONFLICT DO NOTHING;

-- US Tier 1
INSERT INTO outlet_list_members (outlet_list_id, outlet_id)
VALUES
    ('d1000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000026'),  -- STAT News
    ('d1000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000027'),  -- FiercePharma
    ('d1000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000028'),  -- BioPharma Dive
    ('d1000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000029'),  -- Endpoints News
    ('d1000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000030'),  -- Reuters
    ('d1000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000031'),  -- Bloomberg
    ('d1000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000032'),  -- Associated Press
    ('d1000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000033'),  -- Wall Street Journal
    ('d1000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000034'),  -- New York Times
    ('d1000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000035'),  -- Washington Post
    ('d1000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000036')   -- CNBC
ON CONFLICT DO NOTHING;

-- US Trade Priority
INSERT INTO outlet_list_members (outlet_list_id, outlet_id)
VALUES
    ('d1000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000037'),  -- MedPage Today
    ('d1000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000038'),  -- Neurology Advisor
    ('d1000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000039'),  -- FirstWord Pharma
    ('d1000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000040'),  -- BioSpace
    ('d1000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000041'),  -- Fierce Healthcare
    ('d1000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000042')   -- Medscape
ON CONFLICT DO NOTHING;

-- EU Priority (placeholder - no EU outlets in current seed, reserved for expansion)
-- No members inserted yet.

-- Academic Journals Exclude (no specific outlet rows yet; rule-based exclusion handles journals)
-- Members will be added when journal outlets are seeded.
