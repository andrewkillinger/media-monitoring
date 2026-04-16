-- Seed: Media Outlets
-- UUID prefix: d0000000-0000-0000-0000-...
-- Tier values: tier1, tier2, tier3, trade, local, social, other
-- Channel values: print, online, broadcast, social, wire
-- Region values: canada, us, eu, global

INSERT INTO outlets (id, name, slug, tier, channel, url, region, country, language, is_priority, is_excluded)
VALUES

-- ============================================================
-- CANADA PRIORITY OUTLETS
-- ============================================================
('d0000000-0000-0000-0000-000000000001', 'The Globe and Mail',          'globe-and-mail',          'tier1',  'print',     'https://www.theglobeandmail.com',    'canada', 'CA', 'en', true,  false),
('d0000000-0000-0000-0000-000000000002', 'The Toronto Star',            'toronto-star',            'tier1',  'print',     'https://www.thestar.com',            'canada', 'CA', 'en', true,  false),
('d0000000-0000-0000-0000-000000000003', 'National Post',               'national-post',           'tier1',  'print',     'https://nationalpost.com',           'canada', 'CA', 'en', true,  false),
('d0000000-0000-0000-0000-000000000004', 'Ottawa Citizen',              'ottawa-citizen',          'tier2',  'print',     'https://ottawacitizen.com',          'canada', 'CA', 'en', true,  false),
('d0000000-0000-0000-0000-000000000005', 'Vancouver Sun',               'vancouver-sun',           'tier2',  'print',     'https://vancouversun.com',           'canada', 'CA', 'en', true,  false),
('d0000000-0000-0000-0000-000000000006', 'Montreal Gazette',            'montreal-gazette',        'tier2',  'print',     'https://montrealgazette.com',        'canada', 'CA', 'en', true,  false),
('d0000000-0000-0000-0000-000000000007', 'Calgary Herald',              'calgary-herald',          'tier2',  'print',     'https://calgaryherald.com',          'canada', 'CA', 'en', true,  false),
('d0000000-0000-0000-0000-000000000008', 'Bloomberg Canada',            'bloomberg-canada',        'tier1',  'online',    'https://www.bloomberg.com/canada',   'canada', 'CA', 'en', true,  false),
('d0000000-0000-0000-0000-000000000009', 'Edmonton Journal',            'edmonton-journal',        'tier2',  'print',     'https://edmontonjournal.com',        'canada', 'CA', 'en', true,  false),
('d0000000-0000-0000-0000-000000000010', 'BNN Bloomberg',               'bnn-bloomberg',           'tier1',  'broadcast', 'https://www.bnnbloomberg.ca',        'canada', 'CA', 'en', true,  false),
('d0000000-0000-0000-0000-000000000011', 'CBC TV and Radio',            'cbc-tv-radio',            'tier1',  'broadcast', 'https://www.cbc.ca',                 'canada', 'CA', 'en', true,  false),
('d0000000-0000-0000-0000-000000000012', 'CTV News (national)',         'ctv-news-national',       'tier1',  'broadcast', 'https://www.ctvnews.ca',             'canada', 'CA', 'en', true,  false),
('d0000000-0000-0000-0000-000000000013', 'Newfoundland TV',             'newfoundland-tv',         'tier3',  'broadcast', 'https://www.ntvnews.ca',             'canada', 'CA', 'en', true,  false),
('d0000000-0000-0000-0000-000000000014', 'CBC Toronto',                 'cbc-toronto',             'tier2',  'broadcast', 'https://www.cbc.ca/toronto',         'canada', 'CA', 'en', true,  false),
('d0000000-0000-0000-0000-000000000015', 'CTV Toronto',                 'ctv-toronto',             'tier2',  'broadcast', 'https://toronto.ctvnews.ca',         'canada', 'CA', 'en', true,  false),
('d0000000-0000-0000-0000-000000000016', 'Global Toronto',              'global-toronto',          'tier2',  'broadcast', 'https://globalnews.ca/toronto',      'canada', 'CA', 'en', true,  false),

-- ============================================================
-- FRENCH-LANGUAGE CANADA
-- ============================================================
('d0000000-0000-0000-0000-000000000017', 'Le Devoir',                   'le-devoir',               'tier1',  'print',     'https://www.ledevoir.com',           'canada', 'CA', 'fr', true,  false),
('d0000000-0000-0000-0000-000000000018', 'La Presse',                   'la-presse',               'tier1',  'print',     'https://www.lapresse.ca',            'canada', 'CA', 'fr', true,  false),
('d0000000-0000-0000-0000-000000000019', 'Le Journal de Québec',        'le-journal-de-quebec',    'tier2',  'print',     'https://www.journaldequebec.com',    'canada', 'CA', 'fr', true,  false),
('d0000000-0000-0000-0000-000000000020', 'Le Journal de Montréal',      'le-journal-de-montreal',  'tier2',  'print',     'https://www.journaldemontreal.com',  'canada', 'CA', 'fr', true,  false),
('d0000000-0000-0000-0000-000000000021', 'Le Soleil',                   'le-soleil',               'tier2',  'print',     'https://www.lesoleil.com',           'canada', 'CA', 'fr', true,  false),
('d0000000-0000-0000-0000-000000000022', 'La Voix de L''Est',           'la-voix-de-lest',         'tier3',  'print',     'https://www.lavoixdelest.ca',        'canada', 'CA', 'fr', true,  false),
('d0000000-0000-0000-0000-000000000023', 'La Tribune',                  'la-tribune',              'tier3',  'print',     'https://www.latribune.ca',           'canada', 'CA', 'fr', true,  false),
('d0000000-0000-0000-0000-000000000024', 'Journal Métro',               'journal-metro',           'tier3',  'print',     'https://journalmetro.com',           'canada', 'CA', 'fr', true,  false),
('d0000000-0000-0000-0000-000000000025', 'Le Droit',                    'le-droit',                'tier3',  'print',     'https://www.ledroit.com',            'canada', 'CA', 'fr', true,  false),

-- ============================================================
-- US TIER 1
-- ============================================================
('d0000000-0000-0000-0000-000000000026', 'STAT News',                   'stat-news',               'tier1',  'online',    'https://www.statnews.com',           'us',     'US', 'en', true,  false),
('d0000000-0000-0000-0000-000000000027', 'FiercePharma',                'fiercepharma',            'tier1',  'online',    'https://www.fiercepharma.com',       'us',     'US', 'en', true,  false),
('d0000000-0000-0000-0000-000000000028', 'BioPharma Dive',              'biopharma-dive',          'tier1',  'online',    'https://www.biopharmadive.com',      'us',     'US', 'en', true,  false),
('d0000000-0000-0000-0000-000000000029', 'Endpoints News',              'endpoints-news',          'tier1',  'online',    'https://endpts.com',                 'us',     'US', 'en', true,  false),
('d0000000-0000-0000-0000-000000000030', 'Reuters',                     'reuters',                 'tier1',  'wire',      'https://www.reuters.com',            'global', NULL, 'en', true,  false),
('d0000000-0000-0000-0000-000000000031', 'Bloomberg',                   'bloomberg',               'tier1',  'wire',      'https://www.bloomberg.com',          'global', NULL, 'en', true,  false),
('d0000000-0000-0000-0000-000000000032', 'Associated Press',            'associated-press',        'tier1',  'wire',      'https://apnews.com',                 'global', NULL, 'en', true,  false),
('d0000000-0000-0000-0000-000000000033', 'The Wall Street Journal',     'wall-street-journal',     'tier1',  'print',     'https://www.wsj.com',                'us',     'US', 'en', true,  false),
('d0000000-0000-0000-0000-000000000034', 'The New York Times',          'new-york-times',          'tier1',  'print',     'https://www.nytimes.com',            'us',     'US', 'en', true,  false),
('d0000000-0000-0000-0000-000000000035', 'Washington Post',             'washington-post',         'tier1',  'print',     'https://www.washingtonpost.com',     'us',     'US', 'en', true,  false),
('d0000000-0000-0000-0000-000000000036', 'CNBC',                        'cnbc',                    'tier1',  'broadcast', 'https://www.cnbc.com',               'us',     'US', 'en', true,  false),

-- ============================================================
-- US TRADE
-- ============================================================
('d0000000-0000-0000-0000-000000000037', 'MedPage Today',               'medpage-today',           'trade',  'online',    'https://www.medpagetoday.com',       'us',     'US', 'en', true,  false),
('d0000000-0000-0000-0000-000000000038', 'Neurology Advisor',           'neurology-advisor',       'trade',  'online',    'https://www.neurologyadvisor.com',   'us',     'US', 'en', true,  false),
('d0000000-0000-0000-0000-000000000039', 'FirstWord Pharma',            'firstword-pharma',        'trade',  'online',    'https://www.firstwordpharma.com',    'us',     'US', 'en', true,  false),
('d0000000-0000-0000-0000-000000000040', 'BioSpace',                    'biospace',                'trade',  'online',    'https://www.biospace.com',           'us',     'US', 'en', true,  false),
('d0000000-0000-0000-0000-000000000041', 'Fierce Healthcare',           'fierce-healthcare',       'trade',  'online',    'https://www.fiercehealthcare.com',   'us',     'US', 'en', true,  false),
('d0000000-0000-0000-0000-000000000042', 'Medscape',                    'medscape',                'trade',  'online',    'https://www.medscape.com',           'us',     'US', 'en', true,  false),

-- ============================================================
-- OTHER / DEMO OUTLETS
-- ============================================================
('d0000000-0000-0000-0000-000000000043', 'Life Technology',             'life-technology',         'other',  'online',    'https://www.lifetechnology.com',     'us',     'US', 'en', false, false),
('d0000000-0000-0000-0000-000000000044', 'Neuroscience News',           'neuroscience-news',       'other',  'online',    'https://neurosciencenews.com',       'us',     'US', 'en', false, false),
('d0000000-0000-0000-0000-000000000045', 'Business in New Jersey Everyday', 'business-nj-everyday','local',  'online',    'https://businessinnj.com',          'us',     'US', 'en', false, false),
('d0000000-0000-0000-0000-000000000046', 'Parkinson''s Foundation',     'parkinsons-foundation',   'other',  'online',    'https://www.parkinson.org',          'us',     'US', 'en', false, false),
('d0000000-0000-0000-0000-000000000047', 'Market Screener',             'market-screener',         'other',  'online',    'https://www.marketscreener.com',     'global', NULL, 'en', false, false),

-- ============================================================
-- SOCIAL
-- ============================================================
('d0000000-0000-0000-0000-000000000048', 'Twitter / X',                 'twitter-x',               'social', 'social',    'https://x.com',                      'global', NULL, 'en', false, false)

ON CONFLICT (id) DO NOTHING;
