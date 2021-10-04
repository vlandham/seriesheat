create unique index idx_titles_tconst on titles(tconst);
create unique index idx_ratings_tconst on ratings(tconst);
create unique index idx_episodes_tconst on episodes(tconst);

-- create index episode_covering on episodes(parentTconst, tconst, seasonNumber, episodeNumber);
-- create index ratings_covering on ratings(tconst, averageRating, numVotes);

create index idx_episodes_parenttconst on episodes(parentTconst);
create index idx_episodes_parentconst_tconst on episodes(parentTconst, tconst);
