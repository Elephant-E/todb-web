"use client";

import { useState } from "react";
import { Plus, Trash2, Lock, Unlock, Loader2, Search, ImageIcon, Link2, RefreshCw, Tag } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { posterUrl } from "@/lib/utils";
import api from "@/lib/api";
import type { Title, Genre, ImageItem } from "@/types";

interface VideoEditPanelProps {
  videoId: number;
  titles: Title[];
  genres: Genre[];
  genreIds: number[];
  images: ImageItem[];
  isCanEdit: boolean;
  hasEditRole: boolean;
  onTitlesChange: (titles: Title[]) => void;
  onGenresChange: (genreIds: number[]) => void;
  onImagesChange: () => void;
}

export function VideoEditPanel({
  videoId,
  titles,
  genres,
  genreIds,
  images,
  isCanEdit,
  hasEditRole,
  onTitlesChange,
  onGenresChange,
  onImagesChange,
}: VideoEditPanelProps) {
  const { locale } = useLocale();
  const [newTitle, setNewTitle] = useState("");
  const [addingTitle, setAddingTitle] = useState(false);
  const [tmdbType, setTmdbType] = useState<"tv" | "movie">("tv");
  const [tmdbValue, setTmdbValue] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [tmdbSearchTitle, setTmdbSearchTitle] = useState("");

  const l = {
    genres: locale === "zh" ? "类型" : "Genres",
    images: locale === "zh" ? "图片" : "Images",
    sync: locale === "zh" ? "同步" : "Sync",
    add: locale === "zh" ? "添加" : "Add",
    delete: locale === "zh" ? "删除" : "Delete",
    setDefault: locale === "zh" ? "设为默认" : "Default",
    tmdbSync: locale === "zh" ? "TMDB 同步" : "TMDB Sync",
    tmdbSearch: locale === "zh" ? "TMDB 搜索" : "TMDB Search",
    syncFromTmdb: locale === "zh" ? "从 TMDB 同步" : "Sync from TMDB",
    searchTmdb: locale === "zh" ? "搜索 TMDB" : "Search TMDB",
    noAliases: locale === "zh" ? "暂无别名" : "No aliases",
    noImages: locale === "zh" ? "暂无图片" : "No images",
    lock: locale === "zh" ? "锁定" : "Lock",
    unlock: locale === "zh" ? "解锁" : "Unlock",
    poster: locale === "zh" ? "海报" : "Poster",
    backdrop: locale === "zh" ? "背景" : "Backdrop",
    logo: locale === "zh" ? "Logo" : "Logo",
    profile: locale === "zh" ? "头像" : "Profile",
    noEdit: locale === "zh" ? "无编辑权限" : "No edit permission",
    newAlias: locale === "zh" ? "新别名..." : "New alias...",
    searchTitle: locale === "zh" ? "搜索标题..." : "Search title...",
  };

  const handleAddTitle = async () => {
    if (!newTitle.trim()) return;
    setAddingTitle(true);
    try {
      const res = await api.video.titles.create(videoId, newTitle.trim());
      onTitlesChange([...titles, res.data]);
      setNewTitle("");
    } catch {
    } finally {
      setAddingTitle(false);
    }
  };

  const handleDeleteTitle = async (id: number) => {
    try {
      await api.video.titles.delete(videoId, id);
      onTitlesChange(titles.filter((t) => t.id !== id));
    } catch {
    }
  };

  const handleToggleGenre = async (genreId: number) => {
    const next = genreIds.includes(genreId)
      ? genreIds.filter((id) => id !== genreId)
      : [...genreIds, genreId];
    try {
      await api.video.genres.update(videoId, next);
      onGenresChange(next);
    } catch {
    }
  };

  const handleTmdbSync = async () => {
    if (!tmdbValue.trim()) return;
    setSyncing(true);
    try {
      await api.video.sync.tmdb(tmdbType, tmdbValue.trim());
      window.location.reload();
    } catch {
    } finally {
      setSyncing(false);
    }
  };

  const handleTmdbSearch = async () => {
    if (!tmdbSearchTitle.trim()) return;
    setSyncing(true);
    try {
      await api.video.sync.tmdbSearch(tmdbSearchTitle.trim());
    } catch {
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await api.image.delete(imageId);
      onImagesChange();
    } catch {
    }
  };

  const handleSetDefault = async (imageId: number) => {
    try {
      await api.image.setDefault(imageId);
      onImagesChange();
    } catch {
    }
  };

  const handleLock = async (relationType: string, relationId: number) => {
    try {
      await api.common.lock(relationType, relationId);
    } catch {
    }
  };

  const imageTypeLabel = (type: string) => {
    const map: Record<string, string> = { poster: l.poster, backdrop: l.backdrop, logo: l.logo, profile: l.profile };
    return map[type] || type;
  };

  return (
    <div className="space-y-6">
      {isCanEdit && (
        <div>
          <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-3">{l.newAlias}</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTitle()}
              placeholder={l.newAlias}
              className="flex-1 px-3 py-2 rounded-lg bg-bg-input text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:ring-1 focus:ring-text-tertiary"
            />
            <button
              onClick={handleAddTitle}
              disabled={addingTitle}
              className="px-3 py-2 rounded-lg bg-bg-hover text-text-secondary hover:text-text-primary transition-all disabled:opacity-50"
            >
              {addingTitle ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            </button>
          </div>
        </div>
      )}

      {genres.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-3">{l.genres}</h4>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => {
              const isSelected = genreIds.includes(genre.id);
              return (
                <button
                  key={genre.id}
                  onClick={() => isCanEdit && handleToggleGenre(genre.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-text-primary/10 text-text-primary"
                      : "bg-bg-hover text-text-tertiary hover:text-text-secondary"
                  } ${!isCanEdit ? "cursor-default" : ""}`}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isCanEdit && (
        <div>
          <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-3">{l.sync}</h4>
          <div className="space-y-3">
            <div className="flex gap-2">
              <select
                value={tmdbType}
                onChange={(e) => setTmdbType(e.target.value as "tv" | "movie")}
                className="px-3 py-2 rounded-lg bg-bg-input text-sm text-text-primary outline-none"
              >
                <option value="tv">TV</option>
                <option value="movie">Movie</option>
              </select>
              <input
                type="text"
                value={tmdbValue}
                onChange={(e) => setTmdbValue(e.target.value)}
                placeholder="TMDB ID"
                className="flex-1 px-3 py-2 rounded-lg bg-bg-input text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:ring-1 focus:ring-text-tertiary"
              />
              <button
                onClick={handleTmdbSync}
                disabled={syncing}
                className="px-4 py-2 rounded-lg bg-bg-hover text-sm font-medium text-text-secondary hover:text-text-primary transition-all disabled:opacity-50"
              >
                {syncing ? <Loader2 size={14} className="animate-spin" /> : l.syncFromTmdb}
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tmdbSearchTitle}
                onChange={(e) => setTmdbSearchTitle(e.target.value)}
                placeholder={l.searchTitle}
                className="flex-1 px-3 py-2 rounded-lg bg-bg-input text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:ring-1 focus:ring-text-tertiary"
              />
              <button
                onClick={handleTmdbSearch}
                disabled={syncing}
                className="px-4 py-2 rounded-lg bg-bg-hover text-sm font-medium text-text-secondary hover:text-text-primary transition-all disabled:opacity-50"
              >
                {l.searchTmdb}
              </button>
            </div>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-3">{l.images}</h4>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
            {images.map((img) => (
              <div key={img.image_id} className="group relative rounded-lg overflow-hidden bg-bg-hover">
                <img
                  src={posterUrl(img.image_path, "w185") || ""}
                  alt={img.type}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  <span className="text-[10px] text-white font-medium">{imageTypeLabel(img.type)}</span>
                  <div className="flex gap-1">
                    {!img.is_default && (
                      <button
                        onClick={() => handleSetDefault(img.image_id)}
                        className="px-2 py-1 rounded text-[10px] bg-white/20 text-white hover:bg-white/30"
                      >
                        {l.setDefault}
                      </button>
                    )}
                    {img.is_can_delete && (
                      <button
                        onClick={() => handleDeleteImage(img.image_id)}
                        className="px-2 py-1 rounded text-[10px] bg-white/20 text-white hover:bg-white/30"
                      >
                        {l.delete}
                      </button>
                    )}
                  </div>
                </div>
                {img.is_default && (
                  <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-text-primary text-bg-primary">★</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
