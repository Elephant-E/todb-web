"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/components/LocaleProvider";

interface NotificationPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}

export function NotificationPopover({ open, onClose, anchorRef }: NotificationPopoverProps) {
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const zh = locale === "zh";

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-1 w-[480px] max-h-[640px] flex flex-col overflow-hidden rounded-2xl bg-[rgba(10,10,10,0.72)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] shadow-elevated animate-scale-in"
    >
      <div className="px-5 pt-4 pb-3">
        <h2 className="text-sm font-semibold text-white">
          {zh ? "操作历史" : "History"}
        </h2>
      </div>
      <div className="flex-1 flex items-center justify-center px-5 pb-8">
        <div className="flex flex-col items-center gap-3 max-w-[298px]">
          <h3 className="text-sm font-semibold text-white">
            {zh ? "暂无操作记录" : "No activity yet"}
          </h3>
          <p className="text-center text-xs text-white/50 leading-relaxed">
            {zh ? "你的添加、编辑和删除操作会显示在这里。" : "Your add, edit, and delete actions will appear here."}
          </p>
        </div>
      </div>
    </div>
  );
}
