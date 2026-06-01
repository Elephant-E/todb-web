import axios from "axios";
import type {
  VideoListItem,
  VideoDetail,
  VideoInfo,
  Season,
  Episode,
  UserInfo,
  PaginatedResponse,
  VideoListParams,
  VideoSearchParams,
  VideoCreateOrUpdateParams,
  SeasonCreateOrUpdateParams,
  Country,
  Language,
  Genre,
  Title,
  Part,
  ImageItem,
  PersonListItem,
  PersonDetail,
  ExternalId,
  MusicTag,
  MusicSong,
  MusicAlbum,
  MusicAlbumDetail,
  VideoPerson,
} from "@/types";

const WEB_BASE = process.env.NEXT_PUBLIC_WEB_URL || "https://theotherdb.org/api";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.theotherdb.org";

const webClient = axios.create({
  baseURL: WEB_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

webClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== "undefined" && !window.location.pathname.includes("/sign")) {
        window.location.href = "/sign";
      }
    }
    return Promise.reject(err);
  }
);

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const api = {
  sign: {
    check: () => webClient.get<{ is_sign: boolean }>("/sign/check"),
    redirect: () => `${WEB_BASE}/sign`,
  },

  user: {
    info: () => webClient.get<UserInfo>("/user/info"),
    updateAdult: () => webClient.put<{ show_adult: boolean }>("/user/adult"),
    generateApiKey: () => webClient.patch<{ api_key: string }>("/user/key"),
  },

  video: {
    list: (params: VideoListParams) =>
      webClient.get<PaginatedResponse<VideoListItem>>("/video/list", { params }),

    detail: (videoId: number) =>
      webClient.get<VideoDetail>(`/video/${videoId}`),

    info: (videoId: number) =>
      webClient.get<VideoInfo>(`/video/${videoId}/info`),

    search: (params: VideoSearchParams) =>
      webClient.get<PaginatedResponse<VideoListItem>>("/video/search", { params }),

    searchByTitle: (title: string, params?: { include_adult?: boolean; page?: number; page_size?: number }) =>
      webClient.get<PaginatedResponse<VideoListItem>>("/video/searchByTitle", { params: { title, ...params } }),

    createOrUpdate: (data: VideoCreateOrUpdateParams) =>
      webClient.post<{ video_id: number }>("/video/updateOrCreate", data),

    delete: (videoId: number) =>
      webClient.delete(`/video/${videoId}`),

    titles: {
      list: (videoId: number) =>
        webClient.get<Title[]>(`/video/${videoId}/title`),
      create: (videoId: number, title: string) =>
        webClient.post<Title>(`/video/${videoId}/title`, { title }),
      delete: (videoId: number, id: number) =>
        webClient.delete(`/video/${videoId}/title?id=${id}`),
    },

    genres: {
      dict: (videoId: number) =>
        webClient.get<Genre[]>(`/video/${videoId}/genre/dict`),
      list: (videoId: number) =>
        webClient.get<{ is_can_edit: boolean; genre_ids: number[] }>(`/video/${videoId}/genre`),
      update: (videoId: number, genre_ids: number[]) =>
        webClient.post<{ genre_ids: number[] }>(`/video/${videoId}/genre`, { genre_ids }),
    },

    sync: {
      tmdb: (type: "tv" | "movie", value: string) => {
        const form = new FormData();
        form.append("type", type);
        form.append("value", value);
        return webClient.post("/video/sync/tmdb", form);
      },
      tmdbSearch: (title: string) => {
        const form = new FormData();
        form.append("title", title);
        return webClient.post("/video/sync/tmdbSearch", form);
      },
    },

    season: {
      all: (videoId: number) =>
        webClient.get<Season[]>(`/video/${videoId}/season/all`),
      detail: (videoId: number, seasonNumber: number) =>
        webClient.get<Season>(`/video/${videoId}/season/${seasonNumber}`),
      createOrUpdate: (videoId: number, data: SeasonCreateOrUpdateParams) =>
        webClient.post<{ seasion_id: number }>(`/video/${videoId}/season/updateOrCreate`, data),
      delete: (videoId: number, seasonNumber: number) =>
        webClient.delete(`/video/${videoId}/season/${seasonNumber}`),
    },

    episode: {
      all: (videoId: number, seasonNumber: number) =>
        webClient.get<Episode[]>(`/video/${videoId}/season/${seasonNumber}/episode/all`),
      detail: (videoId: number, seasonNumber: number, episodeNumber: number) =>
        webClient.get<Episode>(`/video/${videoId}/season/${seasonNumber}/episode/${episodeNumber}/info`),
      createOrUpdate: (videoId: number, seasonNumber: number, data: {
        episode_number: number;
        episode_title: string;
        episode_description?: string;
        origin_title?: string;
        date_air?: string;
        runtime?: number;
      }) =>
        webClient.post<{ episode_id: number }>(`/video/${videoId}/season/${seasonNumber}/episode/updateOrCreate`, data),
      delete: (videoId: number, seasonNumber: number, episodeNumber: number) =>
        webClient.delete(`/video/${videoId}/season/${seasonNumber}/episode/${episodeNumber}`),
      createAll: (videoId: number, seasonNumber: number, data: { episode_number: number; episode_title: string; date_air?: string; runtime?: number }[]) =>
        webClient.post(`/video/${videoId}/season/${seasonNumber}/episode/createAll`, { epsodes: data }),
    },

    part: {
      list: (videoId: number, videoEpisodeId?: number) =>
        webClient.get<Part[]>(`/video/${videoId}/part`, { params: videoEpisodeId ? { video_episode_id: videoEpisodeId } : {} }),
      createOrUpdate: (videoId: number, data: {
        type: "movie" | "tv";
        value: number;
        part_number: number;
        part_title: string;
        part_description?: string;
        origin_title?: string;
        date_air?: string;
        runtime?: number;
      }) =>
        webClient.post<{ part_id: number }>(`/video/${videoId}/part`, data),
      delete: (videoId: number, id: number) =>
        webClient.delete(`/video/${videoId}/part?id=${id}`),
    },

    person: {
      list: (videoId: number) =>
        webClient.get<VideoPerson[]>(`/video/${videoId}/person`),
    },
  },

  image: {
    list: (params: { type?: string; relation_type: string; relation_id: number; page?: number; page_size?: number }) =>
      webClient.get<PaginatedResponse<ImageItem>>("/image", { params }),
    upload: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return webClient.put<{ image_id: number; image_path: string }>("/image", form, { headers: { "Content-Type": "multipart/form-data" } });
    },
    save: (data: { type: string; relation_type: string; relation_id: number; language?: string; is_adult?: number; image_path: string }) => {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined) form.append(k, String(v));
      });
      return webClient.post<{ count: number }>("/image", form, { headers: { "Content-Type": "multipart/form-data" } });
    },
    delete: (imageId: number) =>
      webClient.delete(`/image?image_id=${imageId}`),
    setDefault: (imageId: number) =>
      webClient.put(`/image/setDefault?image_id=${imageId}`),
  },

  person: {
    list: (params?: { name?: string; is_virtual?: boolean; page?: number; page_size?: number }) =>
      webClient.get<PaginatedResponse<PersonListItem>>("/person/list", { params }),
    query: (params?: { name?: string; is_virtual?: boolean }) =>
      webClient.get<PaginatedResponse<PersonListItem>>("/person/query", { params }),
    info: (personId: number) =>
      webClient.get<PersonDetail>(`/person/${personId}/info`),
    createOrUpdate: (data: {
      name: string;
      original_name?: string;
      biography?: string;
      birthday?: string;
      deathday?: string;
      gender?: string;
      birthplace?: string;
      homepage?: string;
      is_virtual?: number;
      is_adult?: boolean;
    }) =>
      webClient.post<{ person_id: number }>("/person/updateOrCreate", data),
    delete: (personId: number) =>
      webClient.delete(`/person/${personId}/delete`),
  },

  music: {
    tag: {
      list: () => webClient.get<MusicTag[]>("/music/tag/list"),
      create: (name: string) =>
        webClient.post<MusicTag>("/music/tag/create", { name }),
      delete: (tagId: number) =>
        webClient.delete(`/music/tag/delete?tag_id=${tagId}`),
    },
    song: {
      list: (params?: { title?: string; tag_id?: number; page?: number; page_size?: number }) =>
        webClient.get<PaginatedResponse<MusicSong>>("/music/song/list", { params }),
      detail: (songId: number) =>
        webClient.get<MusicSong>(`/music/song/${songId}`),
      createOrUpdate: (data: { name: string; description?: string; tagline?: string; release_date?: string; isrc?: string; duration?: number; type?: string; release_company?: string; is_adult?: boolean; image_poster?: string; person_id_artists?: number[] }) =>
        webClient.post<{ song_id: number }>("/music/song/updateOrCreate", data),
      delete: (songId: number) =>
        webClient.delete(`/music/song/${songId}`),
    },
    album: {
      list: (params?: { title?: string; tag_id?: number; page?: number; page_size?: number }) =>
        webClient.get<PaginatedResponse<MusicAlbum>>("/music/album/list", { params }),
      detail: (albumId: number) =>
        webClient.get<MusicAlbumDetail>(`/music/album/${albumId}`),
      createOrUpdate: (data: { name: string; description?: string; tagline?: string; release_date?: string; upc?: string; type?: string; release_company?: string; is_adult?: boolean; image_poster?: string; image_backdrop?: string; person_id_artists?: number[] }) =>
        webClient.post<{ album_id: number }>("/music/album/updateOrCreate", data),
      delete: (albumId: number) =>
        webClient.delete(`/music/album/${albumId}`),
      songs: (albumId: number) =>
        webClient.get<MusicSong[]>(`/music/album/${albumId}/song`),
      updateSongs: (albumId: number, song_ids: number[]) =>
        webClient.post(`/music/album/${albumId}/song`, { song_ids }),
    },
  },

  dict: {
    countries: () => webClient.get<Country[]>("/dict/countries"),
    languages: () => webClient.get<Language[]>("/dict/languages"),
  },

  common: {
    lock: (relation_type: string, relation_id: number) =>
      webClient.put<{ is_lock: boolean }>(`/common/lock?relation_type=${relation_type}&relation_id=${relation_id}`),
  },
};

export const tokenApi = {
  setToken: (token: string) => {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },

  video: {
    list: (params: VideoListParams) =>
      apiClient.get<PaginatedResponse<VideoListItem>>("/video/list", { params }),
    detail: (videoId: number) =>
      apiClient.get<VideoDetail>(`/video/${videoId}`),
    search: (params: VideoSearchParams) =>
      apiClient.get<PaginatedResponse<VideoListItem>>("/video/search", { params }),
    searchByTitle: (title: string, params?: { include_adult?: boolean; page?: number; page_size?: number }) =>
      apiClient.get<PaginatedResponse<VideoListItem>>("/video/searchByTitle", { params: { title, ...params } }),
    info: (videoId: number) =>
      apiClient.get<VideoInfo>(`/video/${videoId}/info`),
    seasonInfo: (videoId: number, seasonNumber: number) =>
      apiClient.get<Season>(`/video/${videoId}/season/${seasonNumber}/info`),
    allSeason: (videoId: number) =>
      apiClient.get<Season[]>(`/video/${videoId}/allSeason`),
    episodeInfo: (videoId: number, seasonNumber: number, episodeNumber: number) =>
      apiClient.get<Episode>(`/video/${videoId}/season/${seasonNumber}/episode/${episodeNumber}/info`),
    allEpisode: (videoId: number) =>
      apiClient.get<Episode[]>(`/video/${videoId}/allEpisode`),
    titles: (videoId: number) =>
      apiClient.get<Title[]>(`/video/${videoId}/titles`),
    genres: (videoId: number) =>
      apiClient.get<Genre[]>(`/video/${videoId}/genres`),
    externalIds: (videoId: number) =>
      apiClient.get<ExternalId[]>(`/video/${videoId}/externalIds`),
    getVideoIdByExternalId: (type: string, value: string) =>
      apiClient.get<VideoListItem[]>(`/video/getVideoIdByExternalId`, { params: { type, value } }),
  },

  person: {
    search: (params: { name?: string; is_virtual?: boolean }) =>
      apiClient.get<PaginatedResponse<PersonListItem>>("/person/search", { params }),
    info: (personId: number) =>
      apiClient.get(`/person/${personId}/info`),
  },
};


export default api;
