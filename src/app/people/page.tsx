"use client";

import { Suspense, useState, useCallback } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Users } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { useLocale } from "@/components/LocaleProvider";
import { profileUrl } from "@/lib/utils";
import { useInfiniteScroll } from "@/lib/useInfiniteScroll";
import api from "@/lib/api";
import type { PersonListItem } from "@/types";

function PeopleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();

  const [searchName, setSearchName] = useState(searchParams.get("name") || "");

  const filtersKey = `${searchName}`;

  const fetchPage = useCallback(async (page: number, pageSize: number) => {
    const params = {
      page,
      page_size: pageSize,
      ...(searchName && { name: searchName }),
    };
    const res = await api.person.list(params);
    return { items: res.data.items, total: res.data.total };
  }, [searchName]);

  const { items, total, loading, loadingMore, sentinelRef, hasMore } = useInfiniteScroll<PersonListItem>({
    depsKey: filtersKey,
    fetchPage,
  });

  const handleSearch = (value: string) => {
    setSearchName(value);
    const params = new URLSearchParams();
    if (value) params.set("name", value);
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
