import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { mInput, mLabel, mBtn } from "@/lib/modal-styles";
import api from "@/lib/api";

interface SyncModalProps {
  open: boolean;
  onClose: () => void;
  l: { sync: string };
  locale: "zh" | "en";
}

export default function SyncModal({ open, onClose, l, locale }: SyncModalProps) {
  const [tmdbType, setTmdbType] = useState<"tv" | "movie">("tv");
  const [tmdbValue, setTmdbValue] = useState("");
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    if (!tmdbValue.trim()) return;
    setSyncing(true);
    try { const v = tmdbValue.trim(); if (/^\d+$/.test(v)) { await api.video.sync.tmdb(tmdbType, v); } else { await api.video.sync.tmdbSearch(v); } window.location.reload(); } catch {} finally { setSyncing(false); }
  };

  const handleClose = () => { onClose(); setTmdbValue(""); };

  return (
    <Modal open={open} onClose={handleClose} title={l.sync}>
      <div>
        <label className={mLabel}>{locale === "zh" ? "类型" : "Type"}</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setTmdbType("movie")} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${tmdbType === "movie" ? "bg-white text-[#111]" : "bg-white/10 text-white/70 hover:text-white border border-white/[0.08]"}`}>{locale === "zh" ? "电影" : "Movie"}</button>
          <button type="button" onClick={() => setTmdbType("tv")} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${tmdbType === "tv" ? "bg-white text-[#111]" : "bg-white/10 text-white/70 hover:text-white border border-white/[0.08]"}`}>{locale === "zh" ? "电视" : "TV"}</button>
        </div>
      </div>
      <div>
        <label className={mLabel}>{locale === "zh" ? "TMDB ID 或标题" : "TMDB ID or Title"}</label>
        <div className="flex gap-2">
          <input type="text" value={tmdbValue} onChange={(e) => setTmdbValue(e.target.value)} placeholder={locale === "zh" ? "输入TMDB ID或者标题" : "Enter TMDB ID or title"} className={`flex-1 ${mInput}`} />
          <button onClick={handleSync} disabled={syncing} className={`${mBtn} shrink-0 bg-white text-[#111] hover:opacity-90 disabled:opacity-50`}>{syncing ? <Loader2 size={14} className="animate-spin" /> : l.sync}</button>
        </div>
      </div>
    </Modal>
  );
}