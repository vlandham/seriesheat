import { Episode } from "../types";
import { nest } from "d3-collection";
import { loadWorker } from "../worker";
import { descending } from "d3-array";

function cleanSearchString(searchString: string): string {
  const cleanString = searchString.replace(/[\W_]+/g, " ");
  return cleanString;
}

export const fetchSearch = async (searchString: string) => {
  const cleanString = cleanSearchString(searchString);
  const worker = await loadWorker();
  const results = await worker.db.query(
    `select t.primaryTitle, t.tconst from searchtitles t where t.primaryTitle match ?;`,
    [`${cleanString}*`]
  );
  return results;
};

export function isNumeric(str: string) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str as unknown as number) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

export const fetchRatings = async (parentId: string) => {
  const worker = await loadWorker();
  const parentData = await worker.db.query(
    `select t.tconst, t.primaryTitle from searchtitles t where t.tconst = '${parentId}';`
  );
  let ratingsData = (await worker.db.query(
    `SELECT e.tconst, e.seasonNumber, e.episodeNumber, r.averageRating, r.numVotes from episodes e  left join ratings r on e.tconst = r.tconst where e.parentTconst = '${parentId}'; `
  )) as Episode[];
  let output: any = {};

  console.log("raw", ratingsData);

  if (ratingsData) {
    const seasonEpisodeCounts: Record<string | number, number> = {};

    // ratingsData.sort((a, b) => b.numVotes - a.numVotes)

    // ratingsData = ratingsData.filter((episode: Episode) => episode.averageRating)
    ratingsData.forEach((episode: Episode) => {
      if (isNumeric(episode.seasonNumber as string)) {
        episode.seasonNumber = parseInt(episode.seasonNumber as string);
      } else {
        episode.seasonNumber = "U";
      }

      if (isNumeric(episode.episodeNumber as string)) {
        episode.episodeNumber = parseInt(episode.episodeNumber as string);
      } else {
        console.log("episode not numeric", episode.episodeNumber);
        if (!seasonEpisodeCounts[episode.seasonNumber]) {
          seasonEpisodeCounts[episode.seasonNumber] = 0;
        }
        episode.episodeNumber = seasonEpisodeCounts[episode.seasonNumber] + 1;
        seasonEpisodeCounts[episode.seasonNumber] = episode.episodeNumber;
      }

      if (isNumeric(episode.seasonNumber as string)) {
        episode.seasonEpisode =
          +episode.seasonNumber * 100 + (episode.episodeNumber as number);
      } else {
        episode.seasonEpisode =
          (episode.seasonNumber as string) + episode.episodeNumber.toString();
      }
    });
    ratingsData.sort(
      (a: Episode, b: Episode) =>
        (a.seasonEpisode as any) - (b.seasonEpisode as any)
    );
    ratingsData = ratingsData.filter((e) => e.episodeNumber > 0);

    const byEpisode = nest<Episode, Episode>()
      .key((d) => d.seasonNumber as string)
      .key((d) => d.episodeNumber as string)
      .rollup((d) => {
        if (d.length > 1) {
          console.log("duplicate entries", d);
        }
        d.sort((a, b) => descending(a.numVotes ?? 0, b.numVotes ?? 0));
        return d[0];
      })
      .entries(ratingsData);

    ratingsData = [];
    byEpisode.forEach((s) => {
      s.values.forEach((e: any) => {
        ratingsData.push(e.value);
      });
    });
    console.log("cleaned", ratingsData);
  }

  if (parentData && parentData.length > 0) {
    output = parentData[0];
    output.episodes = ratingsData;
  }

  return output;
};
