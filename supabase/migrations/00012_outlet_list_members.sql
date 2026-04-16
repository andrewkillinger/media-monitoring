-- M2M: outlet_lists <-> outlets

create table outlet_list_members (
    outlet_list_id  uuid not null references outlet_lists(id) on delete cascade,
    outlet_id       uuid not null references outlets(id) on delete cascade,
    primary key (outlet_list_id, outlet_id)
);
