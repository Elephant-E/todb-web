import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

interface DetailHeroProps {
  backdropUrl: string | null;
  onBack: () => void;
  backLabel: string;
  posterSlot: ReactNode;
  infoSlot: ReactNode;
  priorityBackdrop?: boolean;
}

export default function DetailHero({
  backdropUrl: bd,
  onBack,
  backLabel,
  posterSlot,
  infoSlot,
  priorityBackdrop = false,
}: DetailHeroProps) {
  return (
    <div className="relative">
      {bd && (
        <div className="absolute inset-0 z-0">
          <Image
            src={bd}
            alt=""
            fill
            sizes="100vw"
            priority={priorityBackdrop}
            unoptimized
            className="object-[center_top] object-cover"
            role="presentation"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}
      <div className="relative z-10 pt-[96px]">
        <div className="px-6"><div className="max-w-[1400px] mx-auto w-full">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium transition-all text-white/40 hover:text-white/70 mb-2">
            <ArrowLeft size={16} /> {backLabel}
          </button>
        </div></div>
        <div className="min-h-[50vh] flex flex-col px-6 pb-8 pt-8">
          <div className="max-w-[1400px] mx-auto w-full mt-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 mx-auto md:mx-0">{posterSlot}</div>
              <div className="flex-1 min-w-0">{infoSlot}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
