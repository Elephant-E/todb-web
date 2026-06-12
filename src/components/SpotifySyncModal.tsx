"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Loader2, Music, Search, X } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { Modal } from "@/components/Modal";
import { profileUrl } from "@/lib/utils";
import api from "@/lib/api";
import { mInput, mLabel } from "@/lib/modal-styles";
import type { ExternalPersonItem } from "@/types";

interface SpotifySyncModalProps {
  open: boolean;
  onClose: () => void;
}

export function SpotifySyncModal({ open, onClose }: SpotifySyncModalProps) {
  const { locale } = useLocale();
  const zh = locale === "zh";
  const lbl = (z: string, e: string) => zh ? z : e;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ExternalPersonItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">("success");
  const [hasSearched, setHasSearched] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout>>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const seqRef = useRef(0);

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    seqRef.current = 0;
    setQuery("");
    setResults([]);
    setSearching(false);
    setSyncingId(null);
    setMsg("");
    setHasSearched(false);
  }, []);

  useEffect(() => {
    if (open) {
      reset();
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open, reset]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setMsg("");
    if (timer.current) clearTimeout(timer.current);
    if (!value.trim()) {
      setResults([]);
      setSearching(false);
      setHasSearched(false);
      seqRef.current = 0;
      return;
    }
    setSearching(true);
    const seq = ++seqRef.current;
    timer.current = setTimeout(async () => {
      try {
        const res = await api.person.ext.list({ type: "spotify", relation_name: value.trim(), page_size: 10 });
        if (seq !== seqRef.current) return; // stale
        setResults(res.data.items || []);
        setHasSearched(true);
      } catch {
        if (seq !== seqRef.current) return;
        setResults([]);
        setHasSearched(true);
      } finally {
        if (seq === seqRef.current) setSearching(false);
      }
    }, 400);
  };

  const handleSync = async (artistId: string) => {
    setSyncingId(artistId);
    setMsg("");
    try {
      await api.music.sync.spotifyPerson(artistId);
      setMsg(lbl("同步成功", "Sync successful"));
      setMsgType("success");
      // mark as linked locally
      setResults((prev) =>
        prev.map((r) =>
          r.spotify_artist_id === artistId ? { ...r, person_id: 1 } : r
        )
      );
    } catch (err: unknown) {
      const errMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || lbl("同步失败", "Sync failed");
      setMsg(errMsg);
      setMsgType("error");
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={lbl("从 Spotify 同步歌手", "Sync from Spotify")}
      width="w-[520px]"
    >
      {/* search input */}
      <div>
        <label className={mLabel}>
          {lbl("搜索歌手", "Search Artist")}
        </label>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className={`${mInput} pl-10 ${query ? "pr-10" : "pr-4"}`}
            placeholder={lbl("输入 Spotify 歌手名...", "Enter Spotify artist name...")}
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-white/30 hover:text-white/60 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* results */}
      {searching && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-white/30">
          <Loader2 size={16} className="animate-spin" />
          {lbl("搜索中...", "Searching...")}
        </div>
      )}

      {!searching && results.length > 0 && (
        <div className="space-y-1.5 max-h-[340px] overflow-y-auto -mx-1 px-1">
          {results.map((item) => {
            const isLinked = !!item.person_id;
            const isThisSyncing = syncingId === item.spotify_artist_id;
            return (
              <div
                key={item.relation_id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
              >
                {/* avatar */}
                <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  {item.image_profile ? (
                    <Image
                      src={profileUrl(item.image_profile, "w185")!}
                      alt=""
                      width={40}
                      height={40}
                      unoptimized
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Music size={16} className="text-white/30" />
                  )}
                </div>

                {/* info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.name}</p>
                  {item.original_name &&
                    item.original_name !== item.name && (
                      <p className="text-xs text-white/30 truncate">
                        {item.original_name}
                      </p>
                    )}
                </div>

                {/* action */}
                {isLinked ? (
                  <span className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] text-white/30">
                    {lbl("已关联", "Linked")}
                  </span>
                ) : (
                  <button
                    onClick={() => handleSync(item.spotify_artist_id!)}
                    disabled={syncingId !== null}
                    className="shrink-0 px-4 py-1.5 rounded-lg text-xs font-medium bg-white text-[#111] hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-1.5"
                  >
                    {isThisSyncing ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      lbl("同步", "Sync")
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!searching && !hasSearched && !query.trim() && (
        <p className="text-sm text-white/20 text-center py-8">
          {lbl("输入关键词搜索 Spotify 歌手", "Enter keywords to search Spotify artists")}
        </p>
      )}

      {!searching && hasSearched && query.trim() && results.length === 0 && (
        <p className="text-sm text-white/30 text-center py-8">
          {lbl("未找到匹配的 Spotify 歌手", "No matching Spotify artists found")}
        </p>
      )}

      {/* message */}
      {msg && (
        <div
          className={`px-4 py-3 rounded-xl text-xs ${
            msgType === "error"
              ? "bg-red-500/10 border border-red-500/20 text-red-400"
              : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
          }`}
        >
          {msg}
        </div>
      )}
    </Modal>
  );
}
