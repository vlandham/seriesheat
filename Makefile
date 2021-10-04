

csv:
	cd data
	csvcut -d $'\t' -c tconst,titleType,primaryTitle,originalTitle  title.basics.tsv > titles.all.csv
	csvcut -d $'\t' title.episode.tsv > title.episode.csv
	csvcut -d $'\t' title.ratings.tsv > title.ratings.csv

series:
	cd data
	csvgrep -c titleType -m tvSeries titles.all.csv > titles.tvseries.csv

db-create:
	rm -f data/imdb.db
	sqlite3 data/imdb.db "VACUUM;"
	csvsql --db "sqlite:///data/imdb.db" --tables "titles" --insert data/imdb/titles.tvseries.csv
	csvsql --db "sqlite:///data/imdb.db" --tables "ratings" --insert data/imdb/title.ratings.csv
	csvsql --db "sqlite:///data/imdb.db" --tables "episodes" --insert data/imdb/title.episode.csv

db-index:
	sqlite3 data/imdb.db < scripts/add_indexes.sql

db-text:
	sqlite3 data/imdb.db < scripts/full_text.sql

db-finalize:
	sqlite3 data/imdb.db < scripts/finalize.sql

db-split:
	rm -rf public/db1
	mkdir public/db1
	./scripts/create_db.sh data/imdb.db public/db1/

db: db-create db-index db-text db-finalize db-split
	echo "done"
