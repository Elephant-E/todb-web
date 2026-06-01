export const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE || "https://image.theotherdb.org";

export function imageUrl(path: string | null, size: string = "w342"): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE}/${size}/${path}`;
}

export const posterUrl = (path: string | null, size: "w185" | "w342" | "w500" | "w780" = "w342") => imageUrl(path, size);
export const backdropUrl = (path: string | null, size: "w300" | "w780" | "w1280" = "w1280") => imageUrl(path, size);
export const logoUrl = (path: string | null, size: "w92" | "w154" | "w185" | "w300" | "w500" = "w300") => imageUrl(path, size);
export const profileUrl = (path: string | null, size: "w45" | "w185" | "h632" = "w185") => imageUrl(path, size);

export function formatDate(dateStr: string | null, locale = "zh"): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function formatYear(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).getFullYear().toString();
}

export function formatRuntime(minutes: number | null, locale = "zh"): string {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (locale === "zh") {
    return h > 0 ? `${h}小时${m}分钟` : `${m}分钟`;
  }
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

export function videoTypeLabel(type: "tv" | "movie", locale: "zh" | "en" = "zh"): string {
  if (locale === "en") return type === "tv" ? "TV" : "Movie";
  return type === "tv" ? "电视" : "电影";
}

export function videoTypeColor(type: "tv" | "movie"): string {
  return type === "tv" ? "text-accent" : "text-success";
}

export const STATUS_MAP: Record<string, { zh: string; en: string }> = {
  rumored: { zh: "传闻中", en: "Rumored" },
  planned: { zh: "已计划", en: "Planned" },
  in_production: { zh: "制作中", en: "In Production" },
  post_production: { zh: "后期制作", en: "Post Production" },
  returning_series: { zh: "连载中", en: "Returning" },
  pilot: { zh: "试播", en: "Pilot" },
  released: { zh: "已上映", en: "Released" },
  canceled: { zh: "已取消", en: "Canceled" },
  ended: { zh: "已完结", en: "Ended" },
};

export function statusLabel(status: string, locale: "zh" | "en" = "zh"): string {
  return STATUS_MAP[status]?.[locale] ?? status;
}
