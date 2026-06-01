"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export function Modal({ open, onClose, title, children, width = "w-full max-w-lg" }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) {
      const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", h);
      return () => document.removeEventListener("keydown", h);
    }
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div ref={ref} className={`relative ${width} max-h-[70vh] mx-4 flex flex-col overflow-hidden rounded-2xl bg-[#111] shadow-[0_8px_40px_rgba(0,0,0,0.25)] border border-[rgba(255,255,255,0.08)] animate-scale-in`}>
        <div className="flex items-center justify-between px-8 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"><X size={18} /></button>
        </div>
        <div className="px-8 pb-6 flex-1 overflow-y-auto space-y-5">
          {children}
        </div>
      </div>
    </div>
  );
}