"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Loader2, Disc3, Music, X } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { useLocale } from "@/components/LocaleProvider";
import { posterUrl } from "@/lib/utils";
import { activeCls, inactiveCls } from "@/lib/filter-styles";
import api from "@/lib/api";
import type { MusicAlbum, MusicSong, MusicTag } from "@/types";

type MusicType = "all" | "album" | "song";

function MusicFilter({
  selectedTagId,
  selectedType,
  tags,
  onChange,
}: {
  selectedTagId: number | undefined;
  selectedType: MusicType;
  tags: MusicTag[];
  onChange: (changes: { tag_id?: number; type?: MusicType }) => void;
}) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(true);
  const hasFilter = selectedTagId !== undefined || selectedType !== "all";

  const zh = locale === "zh";
  const typeOptions: { value: MusicType; label: string }[] = [
    { value: "all", label: zh ? "全部" : "All" },
    { value: "album", label: zh ? "专辑" : "Album" },
    { value: "song", label: zh ? "歌曲" : "Song" },
  ];


  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-text-primary w-full"
      >
        {zh ? "筛选" : "Filter"}
        {hasFilter && (
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full bg-text-primary text-bg-primary">
            1
          </span>
        )}
        <ChevronDown size={14} className={`text-text-tertiary transition-transform duration-200 ml-auto ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="space-y-5 px-4 pb-4 animate-fade-in">
          <div>
            <label className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-2.5 block">
              {zh ? "类型" : "Type"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChange({ type: opt.value })}
                  className={`px-2 py-2 text-[11px] font-medium rounded-lg border whitespace-nowrap transition-all duration-150 ${selectedType === opt.value ? activeCls : inactiveCls}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {tags.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-2.5 block">
                {zh ? "标签" : "Tag"}
              </label>
              <div className="relative">
                <select
                  value={selectedTagId ?? ""}
                  onChange={(e) => onChange({ tag_id: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg bg-bg-input border border-border-primary text-text-primary hover:border-border-secondary focus:border-text-tertiary focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">{zh ? "全部" : "All"}</option>
                  {tags.map((tag) => (
                    <option key={tag.tag_id} value={tag.tag_id}>{tag.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
              </div>
            </div>
          )}
          {hasFilter && (
            <button
              onClick={() => onChange({ tag_id: undefined, type: "all" })}
              className="flex items-center justify-center gap-1.5 w-full px-3.5 py-2.5 text-xs font-medium text-text-tertiary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors"
            >
              <X size={12} /> {zh ? "清除" : "Clear"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function MusicContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const zh = locale === "zh";

  const [albums, setAlbums] = useState<MusicAlbum[]>([]);
  const [songs, setSongs] = useState<MusicSong[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);
  const loadingMoreRef = useRef(false);
  const itemsLenRef = useRef(0);
  const totalRef = useRef(0);

  const [tags, setTags] = useState<MusicTag[]>([]);
  const [searchTitle, setSearchTitle] = useState(searchParams.get("title") || "");
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>(
    searchParams.get("tag_id") ? Number(searchParams.get("tag_id")) : undefined
  );
  const [selectedType, setSelectedType] = useState<MusicType>(
    (searchParams.get("type") as MusicType) || "all"
  );
  const pageSize = 20;

  const filtersKey = `${searchTitle}-${selectedTagId}-${selectedType}`;
  const filtersRef = useRef({ searchTitle, selectedTagId, selectedType });
  filtersRef.current = { searchTitle, selectedTagId, selectedType };

  useEffect(() => {
    api.music.tag.list().then((r) => setTags(r.data)).catch(() => {});
  }, []);

  const buildParams = (p: number) => {
    const f = filtersRef.current;
    return {
      page: p,
      page_size: pageSize,
      ...(f.searchTitle && { title: f.searchTitle }),
      ...(f.selectedTagId && { tag_id: f.selectedTagId }),
    };
  };

  const fetchFirst = useCallback(async () => {
    setLoading(true);
    pageRef.current = 1;
    try {
      const type = filtersRef.current.selectedType;
      if (type === "song") {
        const res = await api.music.song.list(buildParams(1));
        setSongs(res.data.items);
        setAlbums([]);
        setTotal(res.data.total);
        itemsLenRef.current = res.data.items.length;
        totalRef.current = res.data.total;
      } else if (type === "album") {
        const res = await api.music.album.list(buildParams(1));
        setAlbums(res.data.items);
        setSongs([]);
        setTotal(res.data.total);
        itemsLenRef.current = res.data.items.length;
        totalRef.current = res.data.total;
      } else {
        const [albumRes, songRes] = await Promise.all([
          api.music.album.list(buildParams(1)),
          api.music.song.list(buildParams(1)),
        ]);
        setAlbums(albumRes.data.items);
        setSongs(songRes.data.items);
        setTotal(albumRes.data.total + songRes.data.total);
        itemsLenRef.current = albumRes.data.items.length + songRes.data.items.length;
        totalRef.current = albumRes.data.total + songRes.data.total;
      }
    } catch {
      setAlbums([]);
      setSongs([]);
      setTotal(0);
      itemsLenRef.current = 0;
      totalRef.current = 0;
    } finally {
      setLoading(false);
    }
  }, [filtersKey]);

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current) return;
    if (itemsLenRef.current >= totalRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    try {
      const type = filtersRef.current.selectedType;
      if (type === "song") {
        const res = await api.music.song.list(buildParams(nextPage));
        setSongs((prev) => { const next = [...prev, ...res.data.items]; itemsLenRef.current = next.length; return next; });
      } else if (type === "album") {
        const res = await api.music.album.list(buildParams(nextPage));
        setAlbums((prev) => { const next = [...prev, ...res.data.items]; itemsLenRef.current = next.length; return next; });
      }
      pageRef.current = nextPage;
    } catch {} finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [filtersKey]);

  useEffect(() => { void fetchFirst(); }, [fetchFirst]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !loadingMoreRef.current) void loadMore(); },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, filtersKey, loadMore]);

  const handleSearch = (value: string) => {
    setSearchTitle(value);
    const params = new URLSearchParams();
    if (value) params.set("title", value);
    if (selectedTagId) params.set("tag_id", String(selectedTagId));
    if (selectedType !== "all") params.set("type", selectedType);
    router.replace(`/music?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (changes: { tag_id?: number; type?: MusicType }) => {
    const next = { ...filtersRef.current, ...changes };
    setSelectedTagId(next.selectedTagId);
    if (changes.type !== undefined) setSelectedType(changes.type);
    const params = new URLSearchParams();
    if (next.searchTitle) params.set("title", next.searchTitle);
    if (next.selectedTagId) params.set("tag_id", String(next.selectedTagId));
    const nextType = changes.type !== undefined ? changes.type : filtersRef.current.selectedType;
    if (nextType !== "all") params.set("type", nextType);
    router.replace(`/music?${params.toString()}`, { scroll: false });
  };

  const hasMore = itemsLenRef.current < totalRef.current;
  const title = zh ? "音乐" : "Music";
  const songsLabel = zh ? "首歌曲" : "songs";

  return (
    <div className="pt-[72px] min-h-screen px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between py-3">
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-xs text-text-tertiary mt-0.5">
              {loading ? "..." : (zh ? `共 ${total} 项` : `${total} items`)}
            </p>
          </div>
          <SearchBar initialValue={searchTitle} onSearch={handleSearch} placeholder={zh ? "搜索音乐..." : "Search music..."} />
        </div>

        <div className="flex gap-5">
          <aside className="w-52 shrink-0">
            <div className="sticky top-[80px] max-h-[calc(100vh-96px)] overflow-y-auto rounded-xl bg-bg-card p-1.5">
              <MusicFilter selectedTagId={selectedTagId} selectedType={selectedType} tags={tags} onChange={handleFilterChange} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 size={24} className="text-text-tertiary animate-spin" />
              </div>
            ) : albums.length === 0 && songs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-text-tertiary">
                <Disc3 size={48} className="mb-4" />
                <p className="text-sm">{zh ? "没有找到音乐" : "No music found"}</p>
              </div>
            ) : (
              <>
                {albums.length > 0 && (
                  <div className="mb-8">
                    {selectedType === "all" && <h2 className="text-sm font-semibold text-text-secondary mb-3">{zh ? "专辑" : "Albums"}</h2>}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {albums.map((album, i) => {
                        const img = posterUrl(album.image_poster, "w342");
                        const delay = Math.min(i * 50, 300);
                        const artists = (album.person_artists || []).map((a) => a.name).join(", ");
                        return (
                          <Link key={`album-${album.album_id}`} href={`/music/album/${album.album_id}`} className="group block animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-bg-card group-hover:shadow-elevated">
                              {img ? <img src={img} alt={album.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center"><Disc3 size={32} className="text-text-tertiary" /></div>}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="flex items-center gap-2 text-xs text-white/70">
                                  {album.release_date && <span>{album.release_date.slice(0, 4)}</span>}
                                  <span>·</span>
                                  <span>{album.song_count} {songsLabel}</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 px-0.5">
                              <h3 className="text-sm font-medium text-text-primary group-hover:text-text-secondary transition-colors line-clamp-1 text-center">{album.name}</h3>
                              <p className="text-xs text-text-tertiary truncate text-center mt-0.5">{artists}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
                {songs.length > 0 && (
                  <div>
                    {selectedType === "all" && <h2 className="text-sm font-semibold text-text-secondary mb-3">{zh ? "歌曲" : "Songs"}</h2>}
                    <div className="space-y-2">
                      {songs.map((song, i) => {
                        const img = posterUrl(song.image_poster, "w185");
                        const artists = (song.person_artists || []).map((a) => a.name).join(", ");
                        const delay = Math.min(i * 30, 200);
                        return (
                          <div key={`song-${song.song_id}`} className="flex gap-4 p-4 rounded-xl bg-bg-hover/50 hover:bg-bg-hover transition-all animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
                            <div className="w-10 shrink-0 flex items-center justify-center text-xs font-mono text-text-tertiary">{i + 1}</div>
                            {img && <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-bg-card"><img src={img} alt="" className="w-full h-full object-cover" loading="lazy" /></div>}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-text-primary truncate">{song.name}</h4>
                              <div className="flex items-center gap-3 text-xs text-text-tertiary mt-0.5">
                                {artists && <span>{artists}</span>}
                                {song.release_date && <span>{song.release_date.slice(0, 4)}</span>}
                              </div>
                            </div>
                            {song.duration && <div className="shrink-0 flex items-center text-xs text-text-tertiary"><Music size={12} className="mr-1" />{Math.floor(song.duration / 60000)}:{String(Math.floor((song.duration % 60000) / 1000)).padStart(2, "0")}</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {hasMore && selectedType !== "all" && (
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

export default function MusicPage() {
  return (
    <Suspense fallback={
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="text-text-tertiary animate-spin" />
      </div>
    }>
      <MusicContent />
    </Suspense>
  );
}
