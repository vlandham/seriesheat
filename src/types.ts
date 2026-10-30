export type Episode = {
  tconst: string;
  averageRating: number | null;
  numVotes: number | null;
  seasonNumber: number | string;
  episodeNumber: number | string;
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
