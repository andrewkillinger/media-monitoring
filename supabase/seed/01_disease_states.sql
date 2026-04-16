-- Seed: Disease States / Therapeutic Areas
-- UUID prefix: b0000000-0000-0000-0000-...

INSERT INTO disease_states (id, name, slug, description, is_active, display_order)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Rett Syndrome',                  'rett-syndrome',                'Rare genetic neurological disorder caused by mutations in the MECP2 gene.',           true,  10),
    ('b0000000-0000-0000-0000-000000000002', 'Parkinson''s Disease',            'parkinsons-disease',           'Progressive neurological disorder affecting movement and dopamine production.',        true,  20),
    ('b0000000-0000-0000-0000-000000000003', 'Alzheimer''s Disease',            'alzheimers-disease',           'Progressive neurodegenerative disease and the most common form of dementia.',         true,  30),
    ('b0000000-0000-0000-0000-000000000004', 'Schizophrenia',                   'schizophrenia',                'Chronic and severe mental disorder affecting thinking, feeling, and behavior.',        true,  40),
    ('b0000000-0000-0000-0000-000000000005', 'Prader-Willi Syndrome',           'prader-willi-syndrome',        'Rare genetic condition causing physical, mental, and behavioral problems.',           true,  50),
    ('b0000000-0000-0000-0000-000000000006', 'Fragile X Syndrome',              'fragile-x-syndrome',           'Most common inherited cause of intellectual disability.',                            true,  60),
    ('b0000000-0000-0000-0000-000000000007', 'Lewy Body Dementia',              'lewy-body-dementia',           'Second most common form of progressive dementia after Alzheimer''s disease.',         false, 70),
    ('b0000000-0000-0000-0000-000000000008', 'Essential Tremor',                'essential-tremor',             'Most common movement disorder causing involuntary rhythmic shaking.',                 false, 80),
    ('b0000000-0000-0000-0000-000000000009', 'Major Depressive Disorder',       'major-depressive-disorder',    'Common mental health condition causing persistent feelings of sadness and loss.',     false, 90),
    ('b0000000-0000-0000-0000-000000000010', 'Treatment-Resistant Depression',  'treatment-resistant-depression','Depression that does not respond adequately to at least two antidepressant trials.',  false, 100)
ON CONFLICT (id) DO NOTHING;
