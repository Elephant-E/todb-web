import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { mBtn } from "@/lib/modal-styles";
import api from "@/lib/api";

interface DeleteVideoModalProps {
  open: boolean;
  onClose: () => void;
  videoId: number;
  onDeleted: () => void;
  l: { deleteVideo: string; confirmDelete: string; deleteWarning: string; back: string };
}

export default function DeleteVideoModal({ open, onClose, videoId, onDeleted, l }: DeleteVideoModalProps) {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => { setDeleting(true); try { await api.video.delete(videoId); onDeleted(); } catch {} finally { setDeleting(false); } };

  return (
    <Modal open={open} onClose={onClose} title={l.deleteVideo}>
      <p className="text-sm text-white/70">{l.deleteWarning}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className={`${mBtn} text-white/60 hover:text-white hover:bg-white/10`}>{l.back}</button>
        <button onClick={handleDelete} disabled={deleting} className={`${mBtn} bg-red-500 text-white hover:bg-red-600 disabled:opacity-50`}>{deleting ? <Loader2 size={14} className="animate-spin" /> : l.confirmDelete}</button>
      </div>
    </Modal>
  );
}