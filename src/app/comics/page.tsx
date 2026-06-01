"use client";

import { useLocale } from "@/components/LocaleProvider";
import { BookOpen } from "lucide-react";

export default function ComicsPage() {
  const { locale } = useLocale();
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center pt-[80px]">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-bg-hover flex items-center justify-center">
          <BookOpen size={32} className="text-text-tertiary" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">{locale === "zh" ? "漫画" : "Comics"}</h1>
        <p className="text-sm text-text-tertiary">{locale === "zh" ? "开发中，敬请期待" : "Coming soon"}</p>
      </div>
    </div>
  );
}