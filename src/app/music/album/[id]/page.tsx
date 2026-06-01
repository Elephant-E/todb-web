"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Disc3, Calendar, Music, Clock, Loader2, Tag, Users,
} from "lucide-react";
import { posterUrl, backdropUrl, formatDate } from "@/lib/utils";
import { useLocale } from "@/components/LocaleProvider";
import { useDetailColors } from "@/lib/useDetailColors";
import DetailHero from "@/components/DetailHero";
import api from "@/lib/api";
import type { MusicAlbumDetail } from "@/types";

const ZH = {
  back: "返回",
  songs: "歌曲",
  tags: "标签",
  noSongs: "暂无歌曲",
  songCount: "歌曲数",
  releaseDate: "发行日期",
  artists: "艺术家",
};
const EN = {
  back: "Back",
  songs: "Songs",
  tags: "Tags",
  noSongs: "No songs yet",
  songCount: "Songs",
  releaseDate: "Release",
  artists: "Artists",
};

export default function AlbumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { locale } = useLocale();
  const albumId = Number(id);
  const l = locale === "zh" ? ZH : EN;

  const [detail, setDetail] = useState<MusicAlbumDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isValidId = !isNaN(albumId) && albumId > 0;

  useEffect(() => {
    if (!isValidId) { setLoading(false); setError(true); return; }
    (async () => {
      try {
        const res = await api.music.album.detail(albumId);
        setDetail(res.data);
      } catch { setError(true); } finally { setLoading(false); }
    })();
  }, [isValidId, albumId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="text-text-tertiary animate-spin" /></div>;
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-text-tertiary">
        <Disc3 size={48} className="mb-4" />
        <p className="text-lg mb-4">{locale === "zh" ? "专辑未找到" : "Album not found"}</p>
        <Link href="/music" className="text-text-secondary hover:text-text-primary text-sm underline">{locale === "zh" ? "浏览音乐" : "Browse music"}</Link>
      </div>
    );
  }

  const bd = backdropUrl(detail.image_backdrop);
  const poster = posterUrl(detail.image_poster, "w500");
  const displayName = detail.name;
  const c = useDetailColors(!!bd);

  const formatDuration = (ms: number | null) => {
    if (!ms) return null;
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <DetailHero
        backdropUrl={bd}
        onBack={() => router.back()}
        backLabel={l.back}
        posterSlot={
          poster ? <img src={poster} alt={detail.name} className={`w-[200px] md:w-[260px] aspect-square rounded-2xl shadow-elevated object-cover ${c.posterB}`} /> : <div className={`w-[200px] md:w-[260px] aspect-square rounded-2xl ${c.posterBg} ${c.posterB} flex items-center justify-center`}><Disc3 size={48} className={c.posterIc} /></div>
        }
        infoSlot={
          <div className="pt-0 md:pt-3">
            <h1 className={`text-3xl md:text-5xl font-bold tracking-tight mb-2 ${c.h1}`}>{displayName}</h1>
            <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm mb-4 ${c.meta}`}>
              {(detail.person_artists || []).length > 0 && (
                <span className="flex items-center gap-1.5"><Users size={14} /> {detail.person_artists.map((a) => a.name).join(", ")}</span>
              )}
              {detail.release_date && (
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {detail.release_date.slice(0, 4)}</span>
              )}
              <span className="flex items-center gap-1.5"><Music size={14} /> {detail.song_count} {l.songs}</span>
              {detail.is_adult && <span>18+</span>}
            </div>
          </div>
        }
      />

      <div className="relative z-10 px-6 pt-4 pb-20">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div>
            <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-4">{l.songs}</h3>
            {detail.songs.length === 0 ? (
              <p className="text-sm text-text-tertiary">{l.noSongs}</p>
            ) : (
              <div className="space-y-2">
                {detail.songs.map((song, i) => {
                  const songPoster = posterUrl(song.image_poster, "w185");
                  return (
                    <div key={song.song_id} className="flex gap-4 p-4 rounded-xl bg-bg-hover/50 hover:bg-bg-hover transition-all group">
                      <div className="w-10 shrink-0 flex items-center justify-center text-xs font-mono text-text-tertiary">{i + 1}</div>
                      {songPoster && (
                        <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-bg-card">
                          <img src={songPoster} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-text-primary truncate">{song.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-text-tertiary mt-0.5">
                          {(song.person_artists || []).length > 0 && <span>{song.person_artists.map((a) => a.name).join(", ")}</span>}
                          {song.release_date && <span>{song.release_date.slice(0, 4)}</span>}
                        </div>
                      </div>
                      {song.duration && (
                        <div className="shrink-0 flex items-center text-xs text-text-tertiary">
                          <Clock size={12} className="mr-1" /> {formatDuration(song.duration)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
