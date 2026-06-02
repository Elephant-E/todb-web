import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { mInput, mLabel, mBtn } from "@/lib/modal-styles";
import api from "@/lib/api";
import type { Season } from "@/types";

interface SeasonModalsProps {
  showAdd: boolean;
  showEdit: boolean;
  showDelete: boolean;
  editSeason: Season | null;
  deleteSeasonNum: number | null;
  videoId: number;
  onCloseAdd: () => void;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onSeasonsChange: (seasons: Season[]) => void;
  l: { addSeason: string; editSeason: string; deleteSeason: string; seasonNumber: string; seasonTitle: string; seasonDesc: string; dateAir: string; back: string; confirmDelete: string; deleteSeasonWarning: string };
}

export default function SeasonModals({ showAdd, showEdit, showDelete, editSeason, deleteSeasonNum, videoId, onCloseAdd, onCloseEdit, onCloseDelete, onSeasonsChange, l }: SeasonModalsProps) {
  const [newSeason, setNewSeason] = useState({ season_number: "1", season_title: "", season_description: "", date_air: "" });
  const [addingSeason, setAddingSeason] = useState(false);
  const [currentEditSeason, setCurrentEditSeason] = useState<Season | null>(null);
  const [savingSeason, setSavingSeason] = useState(false);
  const [deletingSeason, setDeletingSeason] = useState(false);

  useEffect(() => {
    if (!showEdit || !editSeason || currentEditSeason) return;
    const timer = window.setTimeout(() => {
      setCurrentEditSeason(editSeason);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [showEdit, editSeason, currentEditSeason]);

  const handleAdd = async () => {
    const sn = Number(newSeason.season_number); if (!sn) return;
    setAddingSeason(true);
    try { await api.video.season.createOrUpdate(videoId, { season_number: sn, season_title: newSeason.season_title || `第${sn}季`, season_description: newSeason.season_description || undefined, date_air: newSeason.date_air || "1970-01-01" }); const r = await api.video.season.all(videoId); onSeasonsChange(r.data); onCloseAdd(); setNewSeason({ season_number: String(r.data.length + 1), season_title: "", season_description: "", date_air: "" }); } catch {} finally { setAddingSeason(false); }
  };

  const handleEdit = async () => {
    if (!currentEditSeason) return;
    setSavingSeason(true);
    try { await api.video.season.createOrUpdate(videoId, { season_number: currentEditSeason.season_number, season_title: currentEditSeason.season_title || `第${currentEditSeason.season_number}季`, season_description: currentEditSeason.season_description || undefined, date_air: currentEditSeason.date_air || "1970-01-01" }); const r = await api.video.season.all(videoId); onSeasonsChange(r.data); onCloseEdit(); setCurrentEditSeason(null); } catch {} finally { setSavingSeason(false); }
  };

  const handleDelete = async () => {
    if (deleteSeasonNum == null) return;
    setDeletingSeason(true);
    try { await api.video.season.delete(videoId, deleteSeasonNum); const r = await api.video.season.all(videoId); onSeasonsChange(r.data); onCloseDelete(); } catch {} finally { setDeletingSeason(false); }
  };

  const handleCloseAdd = () => { onCloseAdd(); setNewSeason({ season_number: "1", season_title: "", season_description: "", date_air: "" }); };
  const handleCloseEdit = () => { onCloseEdit(); setCurrentEditSeason(null); };

  return (
    <>
      <Modal open={showAdd} onClose={handleCloseAdd} title={l.addSeason}>
        <div><label className={mLabel}>{l.seasonNumber}</label><input type="text" inputMode="numeric" min={1} value={newSeason.season_number} onChange={(e) => setNewSeason((p) => ({ ...p, season_number: e.target.value }))} className={mInput} /></div>
        <div><label className={mLabel}>{l.seasonTitle}</label><input type="text" value={newSeason.season_title} onChange={(e) => setNewSeason((p) => ({ ...p, season_title: e.target.value }))} className={mInput} /></div>
        <div><label className={mLabel}>{l.seasonDesc}</label><input type="text" value={newSeason.season_description} onChange={(e) => setNewSeason((p) => ({ ...p, season_description: e.target.value }))} className={mInput} /></div>
        <div><label className={mLabel}>{l.dateAir}</label><input type="date" value={newSeason.date_air} onChange={(e) => setNewSeason((p) => ({ ...p, date_air: e.target.value }))} className={mInput} /></div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={handleCloseAdd} className={`${mBtn} text-white/60 hover:text-white hover:bg-white/10`}>{l.back}</button>
          <button onClick={handleAdd} disabled={addingSeason} className={`${mBtn} bg-white text-[#111] hover:opacity-90 disabled:opacity-50`}>{addingSeason ? <Loader2 size={14} className="animate-spin" /> : l.addSeason}</button>
        </div>
      </Modal>

      <Modal open={showEdit} onClose={handleCloseEdit} title={l.editSeason}>
        {currentEditSeason && <>
          <div><label className={mLabel}>{l.seasonNumber}</label><input type="text" inputMode="numeric" min={1} value={currentEditSeason.season_number} onChange={(e) => setCurrentEditSeason((p) => p ? { ...p, season_number: Number(e.target.value) || 0 } : p)} className={mInput} /></div>
          <div><label className={mLabel}>{l.seasonTitle}</label><input type="text" value={currentEditSeason.season_title} onChange={(e) => setCurrentEditSeason((p) => p ? { ...p, season_title: e.target.value } : p)} className={mInput} /></div>
          <div><label className={mLabel}>{l.seasonDesc}</label><input type="text" value={currentEditSeason.season_description} onChange={(e) => setCurrentEditSeason((p) => p ? { ...p, season_description: e.target.value } : p)} className={mInput} /></div>
          <div><label className={mLabel}>{l.dateAir}</label><input type="date" value={currentEditSeason.date_air} onChange={(e) => setCurrentEditSeason((p) => p ? { ...p, date_air: e.target.value } : p)} className={mInput} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={handleCloseEdit} className={`${mBtn} text-white/60 hover:text-white hover:bg-white/10`}>{l.back}</button>
            <button onClick={handleEdit} disabled={savingSeason} className={`${mBtn} bg-white text-[#111] hover:opacity-90 disabled:opacity-50`}>{savingSeason ? <Loader2 size={14} className="animate-spin" /> : l.editSeason}</button>
          </div>
        </>}
      </Modal>

      <Modal open={showDelete} onClose={onCloseDelete} title={l.deleteSeason}>
        <p className="text-sm text-white/70">{l.deleteSeasonWarning}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCloseDelete} className={`${mBtn} text-white/60 hover:text-white hover:bg-white/10`}>{l.back}</button>
          <button onClick={handleDelete} disabled={deletingSeason} className={`${mBtn} bg-red-500 text-white hover:bg-red-600 disabled:opacity-50`}>{deletingSeason ? <Loader2 size={14} className="animate-spin" /> : l.confirmDelete}</button>
        </div>
      </Modal>
    </>
  );
}
