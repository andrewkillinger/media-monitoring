-- Story clusters for deduplication / grouping

create table story_clusters (
    id                 uuid primary key default gen_random_uuid(),
    primary_article_id uuid references articles(id) on delete set null,
    title              text,
    article_count      integer not null default 1,
    created_at         timestamptz not null default now(),
    updated_at         timestamptz not null default now()
);

-- Add FK from articles.cluster_id to story_clusters now that the table exists
alter table articles
    add constraint articles_cluster_id_fkey
    foreign key (cluster_id) references story_clusters(id) on delete set null;
