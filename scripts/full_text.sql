DROP TABLE IF EXISTS searchtitles;
CREATE VIRTUAL TABLE searchtitles USING FTS5(tconst, primaryTitle);
INSERT INTO searchtitles SELECT distinct t.tconst, t.primaryTitle FROM titles t inner join (
	select
		e.parentTconst
	from
		episodes e
	inner join ratings r
	where
		r.tconst = e.tconst
		and r.averageRating not NULL) ee on
	ee.parentTconst = t.tconst;


DROP TABLE IF EXISTS titles;
