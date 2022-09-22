export interface MovieType {
  _id: string;
  name: string;
  description: string;
  cover: string;
  adult: boolean;
  backdrop_path: string;
  media_type: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieResponse {
  success: boolean;
  entry: MovieType;
}

export interface MovieListResponse {
  success: boolean;
  entries: MovieType[];
  page?: number;
  total?: number;
}

export interface MovieFilterOption {
  search: string;
}
