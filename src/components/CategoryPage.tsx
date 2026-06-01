"use client";

import { Suspense, useState, useRef, useCallback } from "react";
import { VideoCard } from "@/components/VideoCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterPanel } from "@/components/FilterPanel";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { useInfiniteScroll } from "@/lib/useInfiniteScroll";
import api from "@/lib/api";
import type { VideoListItem, VideoListParams } from "@/types";

interface CategoryPageProps {
  videoType: "movie" | "tv";
  title: string;
}

function CategoryContent({ videoType, title }: CategoryPageProps) {
  const { t } = useLocale();

  const [filters, setFilters] = useState({
    status: undefined as string | undefined,
    year: undefined as string | undefined,
    sort_by: undefined as string | undefined,
    sort_order: undefined as "asc" | "desc" | undefined,
  });

  const filtersKey = JSON.stringify(filters);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchPage = useCallback(async (page: number, pageSize: number) => {
    const f = filtersRef.current;
    const params: VideoListParams = {
      page,
      page_size: pageSize,
      video_type: videoType,
      ...(f.status && { status: f.status as VideoListParams["status"] }),
      ...(f.year && { year: f.year }),
      ...(f.sort_by && { sort_by: f.sort_by as VideoListParams["sort_by"] }),
      ...(f.sort_order && { sort_order: f.sort_order }),
    };
    const res = await api.video.list(params);
    return { items: res.data.items, total: res.data.total };
  }, [videoType, filtersKey]);

  const { items, total, loading, loadingMore, sentinelRef, hasMore } = useInfiniteScroll<VideoListItem>({
    depsKey: `${videoType}-${filtersKey}`,
    fetchPage,
  });

  const handleFilterChange = (changes: Record<string, string | undefined>) => {
    setFilters((prev) => ({ ...prev, ...changes }));
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value ? undefined : prev.status }));
  };

  return (
    <div className="pt-[72px] min-h-screen px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between py-3">
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-xs text-text-tertiary mt-0.5">
              {loading ? "..." : t("browse.total", { count: total })}
            </p>
          </div>
          <SearchBar initialValue="" onSearch={handleSearch} placeholder={t("nav.search")} />
        </div>

        <div className="flex gap-5">
          <aside className="w-52 shrink-0">
            <div className="sticky top-[80px] max-h-[calc(100vh-96px)] overflow-y-auto rounded-xl bg-bg-card p-1.5">
              <FilterPanel filters={filters} onChange={handleFilterChange} showType={false} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 size={24} className="text-text-tertiary animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-text-tertiary">
                <p className="text-sm">{t("browse.noResult")}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {items.map((video, i) => (
                    <VideoCard key={video.video_id} video={video} index={i} />
                  ))}
                </div>
                {hasMore && (
                  <div ref={sentinelRef} className="flex items-center justify-center py-8">
                    {loadingMore && <Loader2 size={20} className="text-text-tertiary animate-spin" />}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategoryPage({ videoType, title }: CategoryPageProps) {
  return (
    <Suspense fallback={
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="text-text-tertiary animate-spin" />
      </div>
    }>
      <CategoryContent videoType={videoType} title={title} />
    </Suspense>
  );
}
