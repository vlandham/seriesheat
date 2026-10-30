import { Episode, SearchResult, Series } from "../types";
import { group, descending } from "d3-array";

declare const process: { env: { API_BASE_URL?: string } };

const API_BASE_URL =
  process.env.API_BASE_URL || "https://seriesheat-api.landham.workers.dev/api";

// IMDb uses the literal string "\N" for missing values
function nullIfMissing<T>(value: T): T | null {
  return value === "\\N" ? null : value;
}

export const fetchSearch = async (
  searchString: string
): Promise<SearchResult[]> => {
  const response = await fetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(searchString)}`
  );
  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }
  const data = await response.json();
  return (data.results as SearchResult[]).map((r) => ({
    ...r,
    startYear: nullIfMissing(r.startYear),
    endYear: nullIfMissing(r.endYear),
  }));
};

export function isNumeric(value: string | number) {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "string") return false;
  return (
    !isNaN(value as unknown as number) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(value))
  ); // ...and ensure strings of whitespace fail
}

export const fetchRatings = async (parentId: string): Promise<Series> => {
  const response = await fetch(
    `${API_BASE_URL}/series/${encodeURIComponent(parentId)}`
  );
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Series not found: ${parentId}`);
    }
    throw new Error(`Failed to fetch ratings: ${response.statusText}`);
  }
  const data = await response.json();
  const rawEpisodes = (data.episodes || []) as Episode[];

  // Normalize season / episode numbers. Non-numeric seasons become "U" (unknown)
  // and non-numeric episodes are numbered sequentially within their season.
  const seasonEpisodeCounts: Record<string | number, number> = {};
  const normalized: Episode[] = rawEpisodes.map((episode) => {
    const seasonNumber = isNumeric(episode.seasonNumber)
      ? +episode.seasonNumber
      : "U";

    let episodeNumber: number;
    if (isNumeric(episode.episodeNumber)) {
      episodeNumber = +episode.episodeNumber;
    } else {
      episodeNumber = (seasonEpisodeCounts[seasonNumber] ?? 0) + 1;
      seasonEpisodeCounts[seasonNumber] = episodeNumber;
    }

    return { ...episode, seasonNumber, episodeNumber };
  });

  // Drop episode 0 / invalid numbers, then keep the most-voted entry when
  // IMDb has duplicates for the same season + episode.
  const valid = normalized.filter((e) => (e.episodeNumber as number) > 0);
  const bySeasonEpisode = group(
    valid,
    (d) => d.seasonNumber,
    (d) => d.episodeNumber
  );

  const episodes: Episode[] = [];
  bySeasonEpisode.forEach((season) => {
    season.forEach((dupes) => {
      const [best] = [...dupes].sort((a, b) =>
        descending(a.numVotes ?? 0, b.numVotes ?? 0)
      );
      episodes.push(best);
    });
  });

  return {
    tconst: data.tconst,
    primaryTitle: data.primaryTitle,
    episodes,
  };
};
