import { useState, useEffect } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Modal } from "@/components/Modal";
import { mInput, mLabel, mBtn } from "@/lib/modal-styles";
import api from "@/lib/api";
import type { Episode } from "@/types";

interface EpisodeModalsProps {
  showEdit: boolean;
  showDelete: boolean;
  showAdd: boolean;
  editEpisode: Episode | null;
  deleteEpisodeNum: number | null;
  videoId: number;
  seasonNumber: number | null;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onCloseAdd: () => void;
  onEpisodesChange: (episodes: Episode[]) => void;
  l: { editEpisode: string; deleteEpisode: string; addEpisodes: string; episodeNumber: string; episodeTitle: string; seasonDesc: string; dateAir: string; runtime: string; runtimeMin: string; runtimeSec: string; back: string; confirmDelete: string; deleteEpisodeWarning: string; addRow: string };
}

export default function EpisodeModals({ showEdit, showDelete, showAdd, editEpisode, deleteEpisodeNum, videoId, seasonNumber, onCloseEdit, onCloseDelete, onCloseAdd, onEpisodesChange, l }: EpisodeModalsProps) {
  const [currentEditEpisode, setCurrentEditEpisode] = useState<Episode | null>(null);
  const [savingEpisode, setSavingEpisode] = useState(false);
  const [deletingEpisode, setDeletingEpisode] = useState(false);
  const [newEpisodes, setNewEpisodes] = useState<Array<{ episode_number: string; episode_title: string; date_air: string; runtime_min: string; runtime_sec: string }>>([{ episode_number: "1", episode_title: "", date_air: "", runtime_min: "", runtime_sec: "" }]);
  const [addingEpisodes, setAddingEpisodes] = useState(false);

  useEffect(() => {
    if (!showEdit || !editEpisode || currentEditEpisode) return;
    const timer = window.setTimeout(() => {
      setCurrentEditEpisode(editEpisode);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [showEdit, editEpisode, currentEditEpisode]);

  const handleEdit = async () => {
    if (!currentEditEpisode || seasonNumber == null) return;
    setSavingEpisode(true);
    try { await api.video.episode.createOrUpdate(videoId, seasonNumber, { episode_number: currentEditEpisode.episode_number, episode_title: currentEditEpisode.episode_title || `第${currentEditEpisode.episode_number}集`, episode_description: currentEditEpisode.episode_description || undefined, date_air: currentEditEpisode.date_air || "1970-01-01", runtime: currentEditEpisode.runtime ?? undefined }); const r = await api.video.episode.all(videoId, seasonNumber); onEpisodesChange(r.data); onCloseEdit(); setCurrentEditEpisode(null); } catch {} finally { setSavingEpisode(false); }
  };

  const handleDelete = async () => {
    if (deleteEpisodeNum == null || seasonNumber == null) return;
    setDeletingEpisode(true);
    try { await api.video.episode.delete(videoId, seasonNumber, deleteEpisodeNum); const r = await api.video.episode.all(videoId, seasonNumber); onEpisodesChange(r.data); onCloseDelete(); } catch {} finally { setDeletingEpisode(false); }
  };

  const handleAdd = async () => {
    if (seasonNumber == null) return;
    const items = newEpisodes.filter((e) => e.episode_number && e.episode_title).map((e) => ({ episode_number: Number(e.episode_number), episode_title: e.episode_title, date_air: e.date_air || "1970-01-01", runtime: (Number(e.runtime_min) + Number(e.runtime_sec) / 60) || undefined }));
    if (items.length === 0) return;
    setAddingEpisodes(true);
    try { await api.video.episode.createAll(videoId, seasonNumber, items); const r = await api.video.episode.all(videoId, seasonNumber); onEpisodesChange(r.data); onCloseAdd(); setNewEpisodes([{ episode_number: "1", episode_title: "", date_air: "", runtime_min: "", runtime_sec: "" }]); } catch {} finally { setAddingEpisodes(false); }
  };

  const handleCloseEdit = () => { onCloseEdit(); setCurrentEditEpisode(null); };
  const handleCloseAdd = () => { onCloseAdd(); setNewEpisodes([{ episode_number: "1", episode_title: "", date_air: "", runtime_min: "", runtime_sec: "" }]); };

  return (
    <>
      <Modal open={showEdit} onClose={handleCloseEdit} title={l.editEpisode}>
        {currentEditEpisode && <>
          <div><label className={mLabel}>{l.episodeNumber}</label><input type="text" inputMode="numeric" min={1} value={currentEditEpisode.episode_number} onChange={(e) => setCurrentEditEpisode((p) => p ? { ...p, episode_number: Number(e.target.value) || 0 } : p)} className={mInput} /></div>
          <div><label className={mLabel}>{l.episodeTitle}</label><input type="text" value={currentEditEpisode.episode_title} onChange={(e) => setCurrentEditEpisode((p) => p ? { ...p, episode_title: e.target.value } : p)} className={mInput} /></div>
          <div><label className={mLabel}>{l.seasonDesc}</label><input type="text" value={currentEditEpisode.episode_description} onChange={(e) => setCurrentEditEpisode((p) => p ? { ...p, episode_description: e.target.value } : p)} className={mInput} /></div>
          <div><label className={mLabel}>{l.dateAir}</label><input type="date" value={currentEditEpisode.date_air} onChange={(e) => setCurrentEditEpisode((p) => p ? { ...p, date_air: e.target.value } : p)} className={mInput} /></div>
          <div>
            <label className={mLabel}>{l.runtime}</label>
            <div className="flex gap-2 items-center">
              <input type="text" inputMode="numeric" value={currentEditEpisode.runtime != null ? String(Math.floor(currentEditEpisode.runtime)) : ""} onChange={(e) => { const sec = currentEditEpisode.runtime != null ? Math.round((currentEditEpisode.runtime - Math.floor(currentEditEpisode.runtime)) * 60) : 0; setCurrentEditEpisode((p) => p ? { ...p, runtime: (Number(e.target.value) || 0) + sec / 60 || null } : p); }} className={`${mInput} flex-1`} placeholder={l.runtimeMin} />
              <span className="text-white/40">:</span>
              <input type="text" inputMode="numeric" value={currentEditEpisode.runtime != null ? String(Math.round((currentEditEpisode.runtime - Math.floor(currentEditEpisode.runtime)) * 60)) : ""} onChange={(e) => { const min = currentEditEpisode.runtime != null ? Math.floor(currentEditEpisode.runtime) : 0; setCurrentEditEpisode((p) => p ? { ...p, runtime: min + (Number(e.target.value) || 0) / 60 || null } : p); }} className={`${mInput} flex-1`} placeholder={l.runtimeSec} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={handleCloseEdit} className={`${mBtn} text-white/60 hover:text-white hover:bg-white/10`}>{l.back}</button>
            <button onClick={handleEdit} disabled={savingEpisode} className={`${mBtn} bg-white text-[#111] hover:opacity-90 disabled:opacity-50`}>{savingEpisode ? <Loader2 size={14} className="animate-spin" /> : l.editEpisode}</button>
          </div>
        </>}
      </Modal>

      <Modal open={showDelete} onClose={onCloseDelete} title={l.deleteEpisode}>
        <p className="text-sm text-white/70">{l.deleteEpisodeWarning}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCloseDelete} className={`${mBtn} text-white/60 hover:text-white hover:bg-white/10`}>{l.back}</button>
          <button onClick={handleDelete} disabled={deletingEpisode} className={`${mBtn} bg-red-500 text-white hover:bg-red-600 disabled:opacity-50`}>{deletingEpisode ? <Loader2 size={14} className="animate-spin" /> : l.confirmDelete}</button>
        </div>
      </Modal>

      <Modal open={showAdd} onClose={handleCloseAdd} title={l.addEpisodes}>
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {newEpisodes.map((ep, i) => (
            <div key={i} className="relative p-4 rounded-xl bg-white/[0.06] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/50">E{ep.episode_number}</span>
                <button onClick={() => { const n = newEpisodes.filter((_, j) => j !== i); setNewEpisodes(n.length ? n : [{ episode_number: "1", episode_title: "", date_air: "", runtime_min: "", runtime_sec: "" }]); }} className="p-1 text-white/30 hover:text-red-400 transition-colors"><X size={12} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-white/50 mb-1 block">{l.episodeNumber}</label><input type="text" inputMode="numeric" min={1} value={ep.episode_number} onChange={(e) => { const n = [...newEpisodes]; n[i] = { ...n[i], episode_number: e.target.value }; setNewEpisodes(n); }} className={mInput} /></div>
                <div><label className="text-xs font-medium text-white/50 mb-1 block">{l.episodeTitle}</label><input type="text" value={ep.episode_title} onChange={(e) => { const n = [...newEpisodes]; n[i] = { ...n[i], episode_title: e.target.value }; setNewEpisodes(n); }} className={mInput} /></div>
                <div><label className="text-xs font-medium text-white/50 mb-1 block">{l.dateAir}</label><input type="date" value={String(ep.date_air)} onChange={(e) => { const n = [...newEpisodes]; n[i] = { ...n[i], date_air: e.target.value }; setNewEpisodes(n); }} className={mInput} /></div>
                <div>
                  <label className="text-xs font-medium text-white/50 mb-1 block">{l.runtime}</label>
                  <div className="flex gap-2 items-center">
                    <input type="text" inputMode="numeric" value={ep.runtime_min} onChange={(e) => { const n = [...newEpisodes]; n[i] = { ...n[i], runtime_min: e.target.value }; setNewEpisodes(n); }} className={`${mInput} flex-1`} placeholder={l.runtimeMin} />
                    <span className="text-white/40">:</span>
                    <input type="text" inputMode="numeric" value={ep.runtime_sec} onChange={(e) => { const n = [...newEpisodes]; n[i] = { ...n[i], runtime_sec: e.target.value }; setNewEpisodes(n); }} className={`${mInput} flex-1`} placeholder={l.runtimeSec} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => { const lastNum = Number(newEpisodes[newEpisodes.length - 1].episode_number) || 0; setNewEpisodes([...newEpisodes, { episode_number: String(lastNum + 1), episode_title: "", date_air: "", runtime_min: "", runtime_sec: "" }]); }} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mt-3"><Plus size={14} /> {l.addRow}</button>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={handleCloseAdd} className={`${mBtn} text-white/60 hover:text-white hover:bg-white/10`}>{l.back}</button>
          <button onClick={handleAdd} disabled={addingEpisodes} className={`${mBtn} bg-white text-[#111] hover:opacity-90 disabled:opacity-50`}>{addingEpisodes ? <Loader2 size={14} className="animate-spin" /> : l.addEpisodes}</button>
        </div>
      </Modal>
    </>
  );
}
