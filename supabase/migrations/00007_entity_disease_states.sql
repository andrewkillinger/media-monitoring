-- M2M: entities <-> disease_states

create table entity_disease_states (
    entity_id         uuid not null references entities(id) on delete cascade,
    disease_state_id  uuid not null references disease_states(id) on delete cascade,
    relationship_type text check (relationship_type in ('treats', 'competes_in', 'researches')),
    primary key (entity_id, disease_state_id)
);
