import { useState } from "react";
import { Loader2, Plus, Lock, Trash2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { mInput, mBtn } from "@/lib/modal-styles";
import api from "@/lib/api";
import type { Title } from "@/types";

interface AliasModalProps {
  open: boolean;
  onClose: () => void;
  videoId: number;
  titles: Title[];
  onTitlesChange: (titles: Title[]) => void;
  canEdit: boolean;
  l: { aliases: string; newAlias: string };
}

export default function AliasModal({ open, onClose, videoId, titles, onTitlesChange, canEdit, l }: AliasModalProps) {
  const [newTitle, setNewTitle] = useState("");
  const [addingTitle, setAddingTitle] = useState(false);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    setAddingTitle(true);
    try { const res = await api.video.titles.create(videoId, newTitle.trim()); onTitlesChange([...titles, res.data]); setNewTitle(""); } catch {} finally { setAddingTitle(false); }
  };
  const handleDelete = async (id: number) => { try { await api.video.titles.delete(videoId, id); onTitlesChange(titles.filter((t) => t.id !== id)); } catch {} };

  const handleClose = () => { onClose(); setNewTitle(""); };

  return (
    <Modal open={open} onClose={handleClose} title={l.aliases}>
      <div className="flex gap-2">
        <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder={l.newAlias} className={`flex-1 ${mInput}`} />
        <button onClick={handleAdd} disabled={addingTitle} className={`${mBtn} bg-white/10 text-white/70 hover:text-white disabled:opacity-50`}>{addingTitle ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}</button>
      </div>
      {titles.length > 0 && <div className="space-y-1.5 max-h-60 overflow-y-auto">{titles.map((title) => (<div key={title.id} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/[0.08]"><span className="text-sm text-white flex-1 truncate">{title.title}</span>{title.is_lock && <Lock size={12} className="text-white/40" />}{canEdit && !title.is_lock && <button onClick={() => handleDelete(title.id)} className="p-1 text-white/40 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>}</div>))}</div>}
    </Modal>
  );
}