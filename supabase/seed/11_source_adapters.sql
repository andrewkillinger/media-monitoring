-- Seed: Source Adapter Configurations

INSERT INTO source_adapters (id, name, adapter_type, settings, is_active, fetch_interval_minutes) VALUES
('00000000-0000-0000-0000-src000000001', 'Google News - Acadia', 'google_news', '{"query": "Acadia Pharmaceuticals OR NUPLAZID OR DAYBUE"}'::jsonb, true, 30),
('00000000-0000-0000-0000-src000000002', 'Google News - Rett Syndrome', 'google_news', '{"query": "Rett syndrome treatment OR MECP2"}'::jsonb, true, 60),
('00000000-0000-0000-0000-src000000003', 'Google News - Parkinsons', 'google_news', '{"query": "Parkinson disease psychosis OR pimavanserin"}'::jsonb, true, 60),
('00000000-0000-0000-0000-src000000004', 'STAT News RSS', 'rss', '{"feedUrl": "https://www.statnews.com/feed/"}'::jsonb, true, 30),
('00000000-0000-0000-0000-src000000005', 'FiercePharma RSS', 'rss', '{"feedUrl": "https://www.fiercepharma.com/rss/xml"}'::jsonb, true, 30),
('00000000-0000-0000-0000-src000000006', 'BioPharma Dive RSS', 'rss', '{"feedUrl": "https://www.biopharmadive.com/feeds/news/"}'::jsonb, true, 30),
('00000000-0000-0000-0000-src000000007', 'Manual URL Import', 'manual_url', '{}'::jsonb, true, 0),
('00000000-0000-0000-0000-src000000008', 'CSV/JSON Import', 'csv_import', '{}'::jsonb, true, 0),
('00000000-0000-0000-0000-src000000009', 'Twitter/X Manual Entry', 'twitter_manual', '{}'::jsonb, true, 0),
('00000000-0000-0000-0000-src000000010', 'Meltwater', 'meltwater', '{"note": "Requires Meltwater API license"}'::jsonb, false, 60),
('00000000-0000-0000-0000-src000000011', 'Factiva', 'factiva', '{"note": "Requires Dow Jones Factiva license"}'::jsonb, false, 60),
('00000000-0000-0000-0000-src000000012', 'Talkwalker', 'talkwalker', '{"note": "Requires Talkwalker API license"}'::jsonb, false, 60),
('00000000-0000-0000-0000-src000000013', 'TV Eyes', 'tveyes', '{"note": "Requires TV Eyes API license"}'::jsonb, false, 60)
ON CONFLICT (id) DO NOTHING;
