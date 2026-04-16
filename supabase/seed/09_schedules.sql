-- Seed: Schedules
-- UUID prefix: 00000000-0000-0000-0000-sch0000000XX

INSERT INTO schedules (id, name, schedule_type, cron_expression, timezone, coverage_cutoff_minutes, is_active, config) VALUES
('00000000-0000-0000-0000-sch000000001', 'Daily Newsletter',       'daily_newsletter',  '0 15 * * 1-5',       'UTC',                  75,   true,  '{"send_time_pt": "08:00", "cutoff_pt": "06:45"}'::jsonb),
('00000000-0000-0000-0000-sch000000002', 'Milestone EOD Report',   'milestone_eod',     '30 22 * * 1-5',      'UTC',                  60,   true,  '{"send_time_pt": "15:30", "cutoff_pt": "14:30", "max_days": 4}'::jsonb),
('00000000-0000-0000-0000-sch000000003', 'Milestone Morning Report','milestone_morning', '30 14 * * 1-5',      'UTC',                  60,   true,  '{"send_time_pt": "07:30", "cutoff_pt": "06:30", "max_days": 2}'::jsonb),
('00000000-0000-0000-0000-sch000000004', 'Ad Hoc Flag',            'ad_hoc',            null,                 'America/Los_Angeles',  0,    true,  '{"realtime": true}'::jsonb),
('00000000-0000-0000-0000-sch000000005', 'Quarterly Report',       'quarterly',         '0 12 1 1,4,7,10 *',  'UTC',                  null, true,  '{}'::jsonb),
('00000000-0000-0000-0000-sch000000006', 'Annual Report',          'annual',            '0 12 15 1 *',        'UTC',                  null, true,  '{}'::jsonb)
ON CONFLICT DO NOTHING;
