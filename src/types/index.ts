export type VideoType = "tv" | "movie";

export type VideoStatus =
  | "rumored"
  | "planned"
  | "in_production"
  | "post_production"
  | "returning_series"
  | "pilot"
  | "released"
  | "canceled"
  | "ended";

export interface VideoListItem {
  video_id: number;
  video_type: VideoType;
  video_title: string;
  video_description: string | null;
  origin_title: string;
  origin_countrys: string[];
  original_languages: string[];
  vote_average: number | null;
  vote_count: number | null;
  date_air: string;
  is_adult: boolean;
  image_poster: string | null;
}

export interface VideoBase {
  video_id: number;
  video_type: VideoType;
  video_title: string;
  video_description: string;
  tagline: string;
  runtime: number | null;
  status: VideoStatus;
  origin_title: string;
  origin_countrys: string[];
  original_languages: string[];
  vote_average: number | null;
  vote_count: number | null;
  date_air: string;
  is_adult: boolean;
  image_poster: string | null;
  image_backdrop: string | null;
  image_logo: string | null;
}

export interface VideoPerson {
  person_id: number;
  name: string;
  original_name: string;
  image_profile: string | null;
  character: string;
  department: "cast" | "crew";
}

export interface VideoDetail extends VideoBase {
  titles_count: number;
  parts_count: number;
  genres: Genre[];
  external_ids: ExternalId[];
  is_can_edit: boolean;
  persons: VideoPerson[];
}

export interface VideoInfo extends VideoBase {
  parts: Part[];
  titles: Title[];
  genres: Genre[];
  external_ids: ExternalId[];
  seasons?: Season[];
}

export interface Season {
  season_id: number;
  season_number: number;
  season_title: string;
  season_description: string;
  origin_title: string | null;
  date_air: string;
  vote_average: number | null;
  vote_count: number | null;
  image_poster: string | null;
  episode_count?: number;
  episodes?: Episode[];
}

export interface Episode {
  episode_id: number;
  episode_number: number;
  episode_title: string;
  episode_description: string;
  origin_title: string | null;
  runtime: number | null;
  date_air: string;
  vote_average: number | null;
  vote_count: number | null;
  image_poster: string | null;
  parts: Part[];
  season_id?: number;
  season_number?: number;
}

export interface Part {
  part_id: number;
  part_number: number;
  part_title: string;
  part_description: string;
  runtime: number | null;
  date_air: string;
  vote_average: number | null;
  vote_count: number | null;
  image_poster: string | null;
}

export interface Title {
  id: number;
  title: string;
  is_lock?: boolean;
  is_can_edit?: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ExternalId {
  type: string;
  value: string;
}

export interface PaginatedResponse<T> {
  page: number;
  page_size: number;
  total: number;
  items: T[];
}

export interface UserInfo {
  oauth_id: string;
  nickname: string | null;
  avatar: string | null;
  roles: string[];
  has_api_key: boolean;
  show_adult: boolean;
  account_url: string;
}

export interface Country {
  code: string;
  name: string;
  english: string;
}

export interface Language {
  code: string;
  name: string;
  english: string;
}

export interface VideoListParams {
  video_type?: VideoType;
  title?: string;
  year?: string;
  status?: VideoStatus;
  sort_by?: "vote_average" | "date_air" | "updated_at";
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export interface VideoCreateOrUpdateParams {
  video_id?: number;
  video_type: VideoType;
  video_title: string;
  video_description: string;
  origin_title?: string | null;
  origin_countrys: string[];
  original_languages?: string[];
  tagline?: string;
  runtime?: number | null;
  status: VideoStatus;
  date_air: string;
  is_adult: boolean;
}

export interface VideoSearchParams {
  video_type?: VideoType;
  title?: string;
  year?: string;
  include_adult?: boolean;
  tmdb_id?: string;
  imdb_id?: string;
  page?: number;
  page_size?: number;
}

export interface SeasonCreateOrUpdateParams {
  season_number: number;
  season_title: string;
  season_description?: string;
  origin_title?: string;
  date_air?: string;
}

export interface ImageItem {
  image_id: number;
  image_path: string;
  type: "backdrop" | "logo" | "poster" | "profile";
  language: string | null;
  width: number | null;
  height: number | null;
  is_default: boolean;
  is_adult: boolean;
  is_can_delete: boolean;
  user: { nickname: string; avatar: string } | null;
}

export interface PersonListItem {
  person_id: number;
  name: string;
  original_name: string | null;
  birthday: string | null;
  deathday: string | null;
  gender: string | null;
  birthplace: string | null;
  is_virtual: number;
  is_adult: boolean;
  image_profile: string | null;
  image_backdrop: string | null;
}

export interface PersonDetail {
  person_id: number;
  name: string;
  original_name: string | null;
  also_known_as: string[];
  tagline: string | null;
  biography: string | null;
  birthday: string | null;
  deathday: string | null;
  gender: string | null;
  homepage: string | null;
  birthplace: string | null;
  is_virtual: number;
  is_adult: boolean;
  updated_at: string;
  image_profile: string | null;
  image_backdrop: string | null;
  external_ids: ExternalId[];
  is_can_edit: boolean;
}

export interface MusicTag {
  tag_id: number;
  name: string;
  is_lock: boolean;
}

export interface MusicSongArtist {
  id: number;
  name: string;
  original_name: string | null;
  gender: string | null;
  is_virtual: boolean;
  is_adult: boolean;
}

export interface MusicSong {
  song_id: number;
  isrc: string | null;
  name: string;
  tagline: string | null;
  release_date: string | null;
  duration: number | null;
  is_adult: boolean;
  image_poster: string | null;
  albums: { album_id: number; name: string }[];
  person_artists: MusicSongArtist[];
}

export interface MusicAlbum {
  album_id: number;
  name: string;
  tagline: string | null;
  album_type: string;
  release_date: string | null;
  is_adult: boolean;
  image_poster: string | null;
  image_backdrop: string | null;
  song_count: number;
  person_artists: MusicSongArtist[];
}

export interface MusicAlbumDetail extends MusicAlbum {
  songs: MusicSong[];
}
