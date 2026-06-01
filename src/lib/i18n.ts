export type Locale = "zh" | "en";

const translations = {
  zh: {
    nav: {
      browse: "浏览",
      movies: "电影",
      tvShows: "电视节目",
      music: "音乐",
      search: "搜索影视...",
      login: "登录",
      startExplore: "开始探索",
    },
    browse: {
      title: "浏览",
      total: "共 {count} 部",
      noResult: "没有找到结果",
      loading: "加载中...",
    },
    movies: {
      title: "电影",
    },
    tvShows: {
      title: "电视节目",
    },
    filter: {
      title: "筛选",
      clear: "清除",
      type: "类型",
      all: "全部",
      movie: "电影",
      tv: "电视",
      status: "状态",
      allStatus: "全部状态",
      released: "已上映",
      rumored: "传闻中",
      postProduction: "后期制作",
      inProduction: "制作中",
      planned: "已计划",
      canceled: "已取消",
      pilot: "试播",
      ended: "已完结",
      returningSeries: "连载中",
      year: "年份",
      allYear: "全部年份",
      sort: "排序",
      airDate: "上映时间",
      rating: "评分",
      updatedAt: "更新时间",
      asc: "升序",
      desc: "降序",
    },
    video: {
      movie: "电影",
      tv: "电视",
      noPoster: "无海报",
      adult: "18+",
    },
    dropdown: {
      user: "用户",
      theme: "主题",
      settings: "设置",
      api: "API",
      logout: "退出登录",
    },
    apiDocs: {
      title: "API",
      subtitle: "Todb Token API — 面向第三方的影视元数据接口",
      auth: "基于 Bearer Token 认证，适用于第三方集成",
      quickStart: "快速开始",
      params: "参数",
      response: "响应示例",
      required: "必填",
      authLabel: "认证",
      endpoints: {
        search: { name: "搜索", desc: "综合搜索影视内容，支持按类型、标题、年份等筛选" },
        searchByTitle: { name: "按标题搜索", desc: "按标题名称搜索影视内容" },
        externalId: { name: "外部ID查询", desc: "通过外部ID（如 TMDB）查询对应的视频ID" },
        videoInfo: { name: "视频详情", desc: "获取视频详细信息" },
        seasonInfo: { name: "季信息", desc: "获取指定季的详细信息" },
        allSeason: { name: "所有季", desc: "获取视频所有季信息" },
        episodeInfo: { name: "集信息", desc: "获取指定集的详细信息" },
        allEpisode: { name: "所有集", desc: "获取视频所有集信息" },
        titles: { name: "别名列表", desc: "获取视频别名/又名列表" },
        genres: { name: "类型列表", desc: "获取视频类型/分类标签" },
        externalIds: { name: "外部ID列表", desc: "获取视频外部ID（tmdb / imdb / tvdb 等）" },
      },
      paramDesc: {
        videoType: "tv / movie",
        title: "搜索标题",
        year: "上映年份",
        includeAdult: "是否包含成人内容",
        tmdbId: "TMDB ID",
        imdbId: "IMDB ID",
        page: "页码",
        pageSize: "每页条数",
        extIdType: "外部ID类型（如 tmdb）",
        extIdValue: "外部ID的值",
        videoId: "视频ID",
        seasonNumber: "季号",
        episodeNumber: "集号",
      },
    },
    scrollToTop: "回到顶部",
    music: {
      title: "音乐",
      developing: "功能开发中，敬请期待",
    },
  },
  en: {
    nav: {
      browse: "Browse",
      movies: "Movies",
      tvShows: "TV Shows",
      music: "Music",
      search: "Search movies & TV shows...",
      login: "Log in",
      startExplore: "Start exploring",
    },
    browse: {
      title: "Browse",
      total: "{count} titles",
      noResult: "No results found",
      loading: "Loading...",
    },
    movies: {
      title: "Movies",
    },
    tvShows: {
      title: "TV Shows",
    },
    filter: {
      title: "Filters",
      clear: "Clear",
      type: "Type",
      all: "All",
      movie: "Movie",
      tv: "TV",
      status: "Status",
      allStatus: "All statuses",
      released: "Released",
      rumored: "Rumored",
      postProduction: "Post Production",
      inProduction: "In Production",
      planned: "Planned",
      canceled: "Canceled",
      pilot: "Pilot",
      ended: "Ended",
      returningSeries: "Returning",
      year: "Year",
      allYear: "All years",
      sort: "Sort",
      airDate: "Air Date",
      rating: "Rating",
      updatedAt: "Updated",
      asc: "Asc",
      desc: "Desc",
    },
    video: {
      movie: "Movie",
      tv: "TV",
      noPoster: "No poster",
      adult: "18+",
    },
    dropdown: {
      user: "User",
      theme: "Theme",
      settings: "Settings",
      api: "API",
      logout: "Log out",
    },
    apiDocs: {
      title: "API",
      subtitle: "Todb Token API — Metadata endpoints for third-party integration",
      auth: "Bearer Token authentication for third-party integration",
      quickStart: "Quick Start",
      params: "Parameters",
      response: "Response Example",
      required: "Required",
      authLabel: "Auth",
      endpoints: {
        search: { name: "Search", desc: "Search movies & TV shows with filters by type, title, year, etc." },
        searchByTitle: { name: "Search by Title", desc: "Search movies & TV shows by title" },
        externalId: { name: "External ID Lookup", desc: "Look up video ID by external ID (e.g. TMDB)" },
        videoInfo: { name: "Video Details", desc: "Get video detailed information" },
        seasonInfo: { name: "Season Info", desc: "Get details for a specific season" },
        allSeason: { name: "All Seasons", desc: "Get all seasons for a video" },
        episodeInfo: { name: "Episode Info", desc: "Get details for a specific episode" },
        allEpisode: { name: "All Episodes", desc: "Get all episodes for a video" },
        titles: { name: "Aliases", desc: "Get alternative titles / aliases" },
        genres: { name: "Genres", desc: "Get genre / category tags" },
        externalIds: { name: "External IDs", desc: "Get external IDs (tmdb / imdb / tvdb etc.)" },
      },
      paramDesc: {
        videoType: "tv / movie",
        title: "Search title",
        year: "Release year",
        includeAdult: "Include adult content",
        tmdbId: "TMDB ID",
        imdbId: "IMDB ID",
        page: "Page number",
        pageSize: "Items per page",
        extIdType: "External ID type (e.g. tmdb)",
        extIdValue: "External ID value",
        videoId: "Video ID",
        seasonNumber: "Season number",
        episodeNumber: "Episode number",
      },
    },
    scrollToTop: "Back to top",
    music: {
      title: "Music",
      developing: "Coming soon",
    },
  },
} as const;

type DeepStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
  ? DeepStringify<U>[]
  : T extends object
  ? { [K in keyof T]: DeepStringify<T[K]> }
  : T;

export type TranslationKey = DeepStringify<typeof translations.zh>;

export function getTranslation(locale: Locale): TranslationKey {
  return translations[locale] as TranslationKey;
}

export function t(locale: Locale, path: string, vars?: Record<string, string | number>): string {
  const keys = path.split(".");
  let result: unknown = translations[locale];
  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  if (typeof result !== "string") return path;
  let str = result;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, String(v));
    });
  }
  return str;
}
