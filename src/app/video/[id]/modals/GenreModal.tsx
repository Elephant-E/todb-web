import { Modal } from "@/components/Modal";

const mTag = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all";

interface GenreModalProps {
  open: boolean;
  onClose: () => void;
  genres: { id: number; name: string }[];
  genreIds: number[];
  onToggleGenre: (genreId: number) => void;
  canEdit: boolean;
  l: { genres: string };
}

export default function GenreModal({ open, onClose, genres, genreIds, onToggleGenre, canEdit, l }: GenreModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={l.genres}>
      <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto">
        {genres.filter((g) => g.name).map((genre, i) => {const isSelected = genreIds.includes(genre.id); return (<button key={`gmodal-${i}-${genre.name}`} onClick={() => canEdit && onToggleGenre(genre.id)} className={`${mTag} ${isSelected ? "bg-white text-[#111]" : "bg-white/10 text-white/70 hover:text-white"} ${!canEdit ? "cursor-default" : ""}`}>{genre.name}</button>);})}
      </div>
    </Modal>
  );
}