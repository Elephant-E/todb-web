"use client";

import { Suspense, useState, useCallback } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Loader2, Users, X } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { useLocale } from "@/components/LocaleProvider";
import { profileUrl } from "@/lib/utils";
import { activeCls, inactiveCls } from "@/lib/filter-styles";
import { useInfiniteScroll } from "@/lib/useInfiniteScroll";
import api from "@/lib/api";
import type { PersonListItem } from "@/types";


function PeopleFilter({
  isVirtual,
  onChange,
}: {
  isVirtual: boolean | undefined;
  onChange: (changes: { is_virtual?: boolean }) => void;
}) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(true);
  const hasFilter = isVirtual !== undefined;

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-text-primary w-full"
      >
        {locale === "zh" ? "筛选" : "Filter"}
        {hasFilter && (
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full bg-text-primary text-bg-primary">
            1
          </span>
        )}
        <ChevronDown size={14} className={`text-text-tertiary transition-transform duration-200 ml-auto ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="space-y-5 px-4 pb-4 animate-fade-in">
          <div>
            <label className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-2.5 block">
              {locale === "zh" ? "类型" : "Type"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { label: locale === "zh" ? "全部" : "All", value: undefined },
                { label: locale === "zh" ? "真实" : "Real", value: false as boolean | undefined },
                { label: locale === "zh" ? "虚拟" : "Virtual", value: true as boolean | undefined },
              ]).map(({ label, value }) => (
                <button
                  key={String(value)}
                  onClick={() => onChange({ is_virtual: value })}
                  className={`px-2 py-2 text-[11px] font-medium rounded-lg border whitespace-nowrap transition-all duration-150 ${isVirtual === value ? activeCls : inactiveCls}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {hasFilter && (
            <button
              onClick={() => onChange({ is_virtual: undefined })}
              className="flex items-center justify-center gap-1.5 w-full px-3.5 py-2.5 text-xs font-medium text-text-tertiary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors"
            >
              <X size={12} /> {locale === "zh" ? "清除" : "Clear"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PeopleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();

  const [searchName, setSearchName] = useState(searchParams.get("name") || "");
  const [isVirtual, setIsVirtual] = useState<boolean | undefined>(
    searchParams.get("is_virtual") === "true" ? true : searchParams.get("is_virtual") === "false" ? false : undefined
  );

  const filtersKey = `${searchName}-${isVirtual}`;

  const fetchPage = useCallback(async (page: number, pageSize: number) => {
    const params = {
      page,
      page_size: pageSize,
      ...(searchName && { name: searchName }),
      ...(isVirtual !== undefined && { is_virtual: isVirtual }),
    };
    const res = await api.person.list(params);
    return { items: res.data.items, total: res.data.total };
  }, [isVirtual, searchName]);

  const { items, total, loading, loadingMore, sentinelRef, hasMore } = useInfiniteScroll<PersonListItem>({
    depsKey: filtersKey,
    fetchPage,
  });

  const handleSearch = (value: string) => {
    setSearchName(value);
    const params = new URLSearchParams();
    if (value) params.set("name", value);
    if (isVirtual !== undefined) params.set("is_virtual", String(isVirtual));
    router.replace(`/people?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (changes: { is_virtual?: boolean }) => {
    const nextIsVirtual = changes.is_virtual;
    setIsVirtual(nextIsVirtual);
    const params = new URLSearchParams();
    if (searchName) params.set("name", searchName);
    if (nextIsVirtual !== undefined) params.set("is_virtual", String(nextIsVirtual));
    router.replace(`/people?${params.toString()}`, { scroll: false });
  };


  const title = locale === "zh" ? "人物" : "People";

  return (
    <div className="pt-[72px] min-h-screen px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between py-3">
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-xs text-text-tertiary mt-0.5">
              {loading ? "..." : (locale === "zh" ? `共 ${total} 人` : `${total} people`)}
            </p>
          </div>
          <SearchBar initialValue={searchName} onSearch={handleSearch} placeholder={locale === "zh" ? "搜索人物..." : "Search people..."} />
        </div>

        <div className="flex gap-5">
          <aside className="w-52 shrink-0">
            <div className="sticky top-[80px] max-h-[calc(100vh-96px)] overflow-y-auto rounded-xl bg-bg-card p-1.5">
              <PeopleFilter isVirtual={isVirtual} onChange={handleFilterChange} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 size={24} className="text-text-tertiary animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-text-tertiary">
                <Users size={48} className="mb-4" />
                <p className="text-sm">{locale === "zh" ? "没有找到人物" : "No people found"}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {items.map((person, i) => {
                    const img = profileUrl(person.image_profile, "w185");
                    const delay = Math.min(i * 50, 300);
                    return (
                      <Link
                        key={person.person_id}
                        href={`/person/${person.person_id}`}
                        className="group block animate-fade-in"
                        style={{ animationDelay: `${delay}ms` }}
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-bg-card group-hover:shadow-elevated">
                          {img ? (
                            <Image
                              src={img}
                              alt={person.name}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                              unoptimized
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Users size={32} className="text-text-tertiary" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {person.is_virtual && (
                            <div className="absolute top-2.5 right-2.5">
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium backdrop-blur-sm bg-white/20 text-white border border-white/30">
                                {locale === "zh" ? "虚拟" : "Virtual"}
                              </span>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            {person.birthday && (
                              <p className="text-xs text-white/70">{person.birthday}</p>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 px-0.5">
                          <h3 className="text-sm font-medium text-text-primary group-hover:text-text-secondary transition-colors line-clamp-1 text-center">
                            {person.name}
                          </h3>
                          {person.original_name && person.original_name !== person.name && (
                            <p className="text-xs text-text-tertiary truncate text-center mt-0.5">{person.original_name}</p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {hasMore && (
                  <div ref={sentinelRef} className="flex items-center justify-center py-8">
                    {loadingMore && <Loader2 size={20} className="text-text-tertiary animate-spin" />}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PeoplePage() {
  return (
    <Suspense fallback={
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="text-text-tertiary animate-spin" />
      </div>
    }>
      <PeopleContent />
    </Suspense>
  );
}
