"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { activeCls, inactiveCls } from "@/lib/filter-styles";

interface FilterPanelProps {
  filters: {
    video_type?: "tv" | "movie";
    status?: string;
    year?: string;
    sort_by?: string;
    sort_order?: "asc" | "desc";
  };
  onChange: (filters: Record<string, string | undefined>) => void;
  showType?: boolean;
}

const sortKeys = ["airDate", "rating", "updatedAt"] as const;
const sortValues = ["date_air", "vote_average", "updated_at"] as const;

const statusKeys = ["released", "rumored", "postProduction", "inProduction", "planned", "canceled", "pilot", "ended", "returningSeries"] as const;
const statusValues = ["released", "rumored", "post_production", "in_production", "planned", "canceled", "pilot", "ended", "returning_series"] as const;

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => String(currentYear - i));


export function FilterPanel({ filters, onChange, showType = true }: FilterPanelProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(true);
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-text-primary w-full"
      >
        {t("filter.title")}
        {activeCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full bg-text-primary text-bg-primary">
            {activeCount}
          </span>
        )}
        <ChevronDown size={14} className={`text-text-tertiary transition-transform duration-200 ml-auto ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-5 px-4 pb-4 animate-fade-in">
          {showType && (
            <div>
              <label className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-2.5 block">{t("filter.type")}</label>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => onChange({ video_type: undefined })} className={`px-2 py-2 text-[11px] font-medium rounded-lg border whitespace-nowrap transition-all duration-150 ${!filters.video_type ? activeCls : inactiveCls}`}>{t("filter.all")}</button>
                <button onClick={() => onChange({ video_type: "movie" })} className={`px-2 py-2 text-[11px] font-medium rounded-lg border whitespace-nowrap transition-all duration-150 ${filters.video_type === "movie" ? activeCls : inactiveCls}`}>{t("filter.movie")}</button>
                <button onClick={() => onChange({ video_type: "tv" })} className={`px-2 py-2 text-[11px] font-medium rounded-lg border whitespace-nowrap transition-all duration-150 ${filters.video_type === "tv" ? activeCls : inactiveCls}`}>{t("filter.tv")}</button>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-2.5 block">{t("filter.status")}</label>
            <div className="relative">
              <select
                value={filters.status || ""}
                onChange={(e) => onChange({ status: e.target.value || undefined })}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg bg-bg-input border border-border-primary text-text-primary hover:border-border-secondary focus:border-text-tertiary focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="">{t("filter.allStatus")}</option>
                {statusKeys.map((k, i) => <option key={statusValues[i]} value={statusValues[i]}>{t(`filter.${k}`)}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-2.5 block">{t("filter.year")}</label>
            <div className="relative">
              <select
                value={filters.year || ""}
                onChange={(e) => onChange({ year: e.target.value || undefined })}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-lg bg-bg-input border border-border-primary text-text-primary hover:border-border-secondary focus:border-text-tertiary focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="">{t("filter.allYear")}</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-2.5 block">{t("filter.sort")}</label>
            <div className="space-y-2">
              {sortKeys.map((k, i) => {
                const isActive = filters.sort_by === sortValues[i];
                return (
                  <button
                    key={sortValues[i]}
                    onClick={() => onChange({ sort_by: sortValues[i] })}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-lg border transition-all duration-150 ${isActive ? activeCls : inactiveCls}`}
                  >
                    <span>{t(`filter.${k}`)}</span>
                    {isActive && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); onChange({ sort_order: filters.sort_order === "asc" ? "desc" : "asc" }); }}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onChange({ sort_order: filters.sort_order === "asc" ? "desc" : "asc" }); } }}
                        className="text-[11px] text-text-tertiary hover:text-text-primary cursor-pointer"
                      >
                        {filters.sort_order === "asc" ? `↑ ${t("filter.asc")}` : `↓ ${t("filter.desc")}`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {activeCount > 0 && (
            <button
              onClick={() => onChange({ video_type: undefined, status: undefined, year: undefined, sort_by: undefined, sort_order: undefined })}
              className="flex items-center justify-center gap-1.5 w-full px-3.5 py-2.5 text-xs font-medium text-text-tertiary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors"
            >
              <X size={12} /> {t("filter.clear")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
