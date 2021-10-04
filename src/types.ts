export type Episode = {
  tconst: string;
  averageRating: number;
  numVotes: number;
  seasonNumber: number | string;
  episodeNumber: number | string;
  seasonEpisode: number | string;
}

export type Series = {
  primaryTitle: string;
  tconst: string;
  episodes: Episode[]
}

export type Margin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
