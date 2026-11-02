export type Episode = {
  tconst: string;
  averageRating: number | null;
  numVotes: number | null;
  seasonNumber: number | string;
  episodeNumber: number | string;
  // Optional: older cached API responses may not include these yet.
  primaryTitle?: string | null;
  startYear?: number | string | null;
  runtimeMinutes?: number | string | null;
}

export type SearchResult = {
  tconst: string;
  primaryTitle: string;
  startYear?: string | number | null;
  endYear?: string | number | null;
  genres?: string | null;
}

export type Series = {
  primaryTitle: string;
  tconst: string;
  episodes: Episode[]
}
