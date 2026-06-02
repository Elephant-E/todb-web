"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tv, Film } from "lucide-react";
import { posterUrl, formatYear, videoTypeLabel } from "@/lib/utils";
import type { VideoListItem } from "@/types";
import { useLocale } from "@/components/LocaleProvider";

interface VideoCardProps {
  video: VideoListItem;
  index?: number;
  viewMode?: "grid" | "list";
}

function PosterPlaceholder({ type }: { type: "tv" | "movie" }) {
  const { t } = useLocale();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-text-tertiary">
      {type === "tv" ? <Tv size={32} /> : <Film size={32} />}
      <span className="text-xs">{t("video.noPoster")}</span>
    </div>
  );
}

export function VideoCard({ video, index = 0, viewMode = "grid" }: VideoCardProps) {
  const { locale, t } = useLocale();
  const poster = posterUrl(video.image_poster, "w342");
  const [imgError, setImgError] = useState(false);
  const delay = Math.min(index * 50, 300);
  const displayTitle = locale === "en" && video.origin_title ? video.origin_title : video.video_title;

  if (viewMode === "list") {
    return (
      <Link
        href={`/video/${video.video_id}`}
        className="group flex gap-4 p-4 rounded-xl bg-bg-card hover:bg-bg-hover transition-all duration-200 animate-fade-in"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="relative w-20 shrink-0 aspect-[2/3] rounded-lg overflow-hidden bg-bg-card">
          {poster && !imgError ? (
            <Image
              src={poster}
              alt={video.video_title}
              fill
              sizes="80px"
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <PosterPlaceholder type={video.video_type} />
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-text-primary/10 text-text-primary">
              {videoTypeLabel(video.video_type, locale)}
            </span>
            {video.is_adult && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-text-primary/10 text-text-primary">{t("video.adult")}</span>
            )}
          </div>

          <h3 className="text-sm font-medium text-text-primary group-hover:text-text-secondary transition-colors line-clamp-1 mb-1">
            {displayTitle}
          </h3>

          {video.video_description && (
            <p className="text-xs text-text-tertiary line-clamp-2 mb-2">
              {video.video_description}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <span>{formatYear(video.date_air)}</span>
            {video.vote_average != null && (
              <span className="text-text-secondary">★ {video.vote_average.toFixed(1)}</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/video/${video.video_id}`}
      className="group block animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-bg-card group-hover:shadow-elevated">
        {poster && !imgError ? (
          <Image
            src={poster}
            alt={video.video_title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <PosterPlaceholder type={video.video_type} />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium backdrop-blur-sm bg-white/20 text-white border border-white/30">
            {videoTypeLabel(video.video_type, locale)}
          </span>
        </div>

        {video.is_adult && (
          <div className="absolute top-2.5 right-2.5">
            <span className="px-1.5 py-0.5 rounded-md text-[11px] font-medium backdrop-blur-sm bg-white/20 text-white border border-white/30">
              {t("video.adult")}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-xs text-white/70 line-clamp-2">
            {video.video_description}
          </p>
        </div>
      </div>

      <div className="mt-3 px-0.5">
        <h3 className="text-sm font-medium text-text-primary group-hover:text-text-secondary transition-colors line-clamp-1">
          {displayTitle}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-text-tertiary">{formatYear(video.date_air)}</span>
          {video.vote_average != null && (
            <span className="text-xs text-text-secondary">★ {video.vote_average.toFixed(1)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
