"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, User, Menu, X, Languages, Plus, Film, Users as UsersIcon, Music as MusicIcon, BookOpen, Gamepad2 } from "lucide-react";
import { UserDropdown } from "@/components/UserDropdown";
import { AddVideoModal } from "@/components/AddVideoModal";
import { AddPersonModal } from "@/components/AddPersonModal";
import { AddMusicModal } from "@/components/AddMusicModal";
import { NotificationPopover } from "@/components/NotificationPopover";
import { useLocale } from "@/components/LocaleProvider";
import api from "@/lib/api";
import type { UserInfo } from "@/types";

export function Navbar() {
  const pathname = usePathname();

  const router = useRouter();
  const { locale, setLocale, t } = useLocale();
  const [searchValue, setSearchValue] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addPersonOpen, setAddPersonOpen] = useState(false);
  const [addMusicOpen, setAddMusicOpen] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showCta, setShowCta] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    (async () => {
      try {
        const res = await api.user.info({ skipAuthRedirect: true });
        setUserInfo(res.data);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const cta = document.getElementById("hero-cta");
    if (!cta) return;
    const observer = new IntersectionObserver(
      ([entry]) => { setShowCta(!entry.isIntersecting); },
      { threshold: 0 }
    );
    observer.observe(cta);
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!addDropdownOpen) return;
    const h = () => { setAddDropdownOpen(false); };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [addDropdownOpen]);

  if (isHome) {
    return (
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center pt-6">
        <nav className="hidden md:flex w-[584px] rounded-full bg-white/[0.08] backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.12)] items-center gap-x-6 px-6 py-2.5 animate-fade-in">
          <div className="flex grow items-center">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/80">
                  <rect x="0" y="0" width="5" height="5" rx="0.5" fill="currentColor" />
                  <rect x="6" y="0" width="5" height="5" rx="0.5" fill="currentColor" />
                  <rect x="0" y="6" width="5" height="5" rx="0.5" fill="currentColor" />
                  <rect x="6" y="6" width="5" height="5" rx="0.5" fill="currentColor" opacity="0.5" />
                </svg>
              </div>
              <span className="text-[15px] font-bold text-white tracking-[-0.3px]">Todb</span>
            </Link>
          </div>

          <span>
            <Link href="/browse" className="w-fit text-[14px] font-semibold text-white/70 hover:text-white transition-opacity">Browse</Link>
          </span>
          <span className="flex items-center">
            {userInfo ? (
              <UserDropdown userInfo={userInfo} />
            ) : (
              <a href="/sign" className="w-fit text-[14px] font-semibold text-white/70 hover:text-white transition-opacity">Log in</a>
            )}
          </span>
          <span className={`overflow-hidden transition-all duration-300 ease-out ${showCta ? "ml-2 max-w-[100px] opacity-100" : "ml-0 max-w-0 opacity-0"}`}>
            <Link
              href="/browse"
              className="relative rounded-full flex items-center justify-center h-9 px-4 text-[13px] font-semibold bg-white text-[#111] hover:bg-white/90 active:bg-white/90 transition-colors cursor-pointer whitespace-nowrap"
            >
              开始探索
            </Link>
          </span>
        </nav>

        <div className="md:hidden rounded-full bg-white/[0.08] backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.12)] px-5 py-2.5 flex items-center gap-4 animate-fade-in">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-white/80">
                <rect x="0" y="0" width="5" height="5" rx="0.5" fill="currentColor" />
                <rect x="6" y="0" width="5" height="5" rx="0.5" fill="currentColor" />
                <rect x="0" y="6" width="5" height="5" rx="0.5" fill="currentColor" />
                <rect x="6" y="6" width="5" height="5" rx="0.5" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <span className="text-[14px] font-bold text-white">Todb</span>
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1 text-white/70">
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-2 rounded-2xl bg-white/[0.08] backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-4 flex flex-col gap-3 animate-fade-in">
            <Link href="/browse" className="text-[13px] font-semibold text-white/70 hover:text-white transition-opacity" onClick={() => setMobileOpen(false)}>Browse</Link>
            {userInfo ? (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {userInfo.avatar ? (
                    <img src={userInfo.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={12} className="text-white/70" />
                  )}
                </div>
                <Link href="/profile" className="text-[13px] font-semibold text-white/70 hover:text-white transition-opacity" onClick={() => setMobileOpen(false)}>
                  {userInfo.nickname || "Profile"}
                </Link>
              </div>
            ) : (
              <a href="/sign" className="text-[13px] font-semibold text-white/70 hover:text-white transition-opacity">Log in</a>
            )}
            <Link href="/browse" className="mt-1 inline-flex items-center justify-center rounded-full h-9 px-4 text-[13px] font-semibold bg-white text-[#111] hover:bg-white/90 transition-colors" onClick={() => setMobileOpen(false)}>
              开始探索
            </Link>
          </div>
          )}
        </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary">
      <nav className="relative hidden md:flex w-full h-[72px] items-center px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0 mr-6">
          <div className="w-7 h-7 rounded-md bg-text-primary/10 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-primary/80">
              <rect x="0" y="0" width="5" height="5" rx="0.5" fill="currentColor" />
              <rect x="6" y="0" width="5" height="5" rx="0.5" fill="currentColor" />
              <rect x="0" y="6" width="5" height="5" rx="0.5" fill="currentColor" />
              <rect x="6" y="6" width="5" height="5" rx="0.5" fill="currentColor" opacity="0.5" />
            </svg>
          </div>
          <span className="text-[16px] font-semibold text-text-primary tracking-tight">Todb</span>
        </Link>

        <div className="flex items-center gap-6">
          {[
            { label: t("nav.browse"), href: "/browse", match: "browse" },
            { label: t("nav.movies"), href: "/movies", match: "movies" },
            { label: t("nav.tvShows"), href: "/tv-shows", match: "tv-shows" },
            { label: t("nav.music"), href: "/music", match: "music" },
            { label: locale === "zh" ? "人物" : "People", href: "/people", match: "people" },
            { label: locale === "zh" ? "书籍" : "Books", href: "/books", match: "books" },
            { label: locale === "zh" ? "漫画" : "Comics", href: "/comics", match: "comics" },
            { label: locale === "zh" ? "游戏" : "Games", href: "/games", match: "games" },
          ].map((tab) => {
            const isActive = pathname === tab.href || (tab.match === "browse" && pathname === "/browse");
            return (
              <Link
                key={tab.match}
                href={tab.href}
                className={`text-[14px] font-medium transition-colors ${
                  isActive ? "text-text-primary" : "text-text-tertiary hover:text-text-primary"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>


        <div className="flex items-center gap-4 shrink-0 ml-auto">
          {userInfo && (
            <div className="relative">
              <button
                onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                className="p-2 text-text-tertiary hover:text-text-primary transition-colors"
                title={locale === "zh" ? "添加" : "Add"}
              >
                <Plus size={18} />
              </button>
              {addDropdownOpen && (
                <div className="absolute right-0 top-12 w-40 rounded-2xl bg-[rgba(10,10,10,0.72)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] shadow-elevated py-1 px-2 animate-scale-in z-50">
                  <button
                    onClick={() => { setAddModalOpen(true); setAddDropdownOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Film size={16} className="text-white/40" /> {locale === "zh" ? "影视" : "Video"}
                  </button>
                  <button
                    onClick={() => { setAddMusicOpen(true); setAddDropdownOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <MusicIcon size={16} className="text-white/40" /> {locale === "zh" ? "音乐" : "Music"}
                  </button>
                  <button
                    onClick={() => { setAddPersonOpen(true); setAddDropdownOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <UsersIcon size={16} className="text-white/40" /> {locale === "zh" ? "人物" : "Person"}
                  </button>
                  <div className="my-1 border-t border-white/[0.08]" />
                  <button
                    onClick={() => { setAddDropdownOpen(false); setComingSoon(true); setTimeout(() => setComingSoon(false), 2000); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <BookOpen size={16} className="text-white/40" /> {locale === "zh" ? "书籍" : "Book"}
                  </button>
                  <button
                    onClick={() => { setAddDropdownOpen(false); setComingSoon(true); setTimeout(() => setComingSoon(false), 2000); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <BookOpen size={16} className="text-white/40" /> {locale === "zh" ? "漫画" : "Comic"}
                  </button>
                  <button
                    onClick={() => { setAddDropdownOpen(false); setComingSoon(true); setTimeout(() => setComingSoon(false), 2000); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Gamepad2 size={16} className="text-white/40" /> {locale === "zh" ? "游戏" : "Game"}
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
            className="p-2 text-text-tertiary hover:text-text-primary transition-colors"
            title={locale === "zh" ? "Switch to English" : "切换到中文"}
          >
            <Languages size={18} />
          </button>
          {userInfo && (
            <div className="relative">
              <button
                ref={bellRef}
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 text-text-tertiary hover:text-text-primary transition-colors"
              >
                <Bell size={18} />
              </button>
              <NotificationPopover open={notifOpen} onClose={() => setNotifOpen(false)} anchorRef={bellRef} />
            </div>
          )}
          {userInfo ? (
            <UserDropdown userInfo={userInfo} />
          ) : (
            <Link
              href="/sign"
              className="text-[13px] font-semibold text-text-primary bg-bg-hover hover:bg-bg-hover/80 px-4 py-2 rounded-full transition-colors"
            >
              {locale === "zh" ? "登录" : "Log in"}
            </Link>
          )}
        </div>
      </nav>

      <div className="md:hidden w-full bg-bg-primary">
        <div className="flex items-center h-[52px] px-4 gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-md bg-text-primary/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-text-primary/80">
                <rect x="0" y="0" width="5" height="5" rx="0.5" fill="currentColor" />
                <rect x="6" y="0" width="5" height="5" rx="0.5" fill="currentColor" />
                <rect x="0" y="6" width="5" height="5" rx="0.5" fill="currentColor" />
                <rect x="6" y="6" width="5" height="5" rx="0.5" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-text-primary">Todb</span>
          </Link>

          <div className="flex-1 h-9 flex items-center gap-2 px-3 rounded-full bg-bg-input">
            <Search size={14} className="text-text-tertiary shrink-0" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={
                pathname === "/movies" ? (locale === "zh" ? "搜索电影..." : "Search movies...")
                : pathname === "/tv-shows" ? (locale === "zh" ? "搜索电视节目..." : "Search TV shows...")
                : t("nav.search")
              }
              className="flex-1 bg-transparent outline-none text-[13px] text-text-primary placeholder:text-text-tertiary"
            />
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 text-text-tertiary">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="px-4 py-3 flex flex-col gap-2 animate-fade-in">
            {[
              { label: t("nav.browse"), href: "/browse" },
              { label: t("nav.movies"), href: "/movies" },
              { label: t("nav.tvShows"), href: "/tv-shows" },
              { label: t("nav.music"), href: "/music" },
              { label: locale === "zh" ? "人物" : "People", href: "/people" },
              { label: locale === "zh" ? "书籍" : "Books", href: "/books" },
              { label: locale === "zh" ? "漫画" : "Comics", href: "/comics" },
              { label: locale === "zh" ? "游戏" : "Games", href: "/games" },
            ].map((tab) => (
              <Link key={tab.href} href={tab.href} className="px-3 py-2.5 text-[14px] font-medium text-text-tertiary hover:text-text-primary rounded-lg hover:bg-bg-hover transition-colors" onClick={() => setMobileOpen(false)}>
                {tab.label}
              </Link>
            ))}
            {userInfo ? (
              <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-text-tertiary hover:text-text-primary rounded-lg hover:bg-bg-hover transition-colors" onClick={() => setMobileOpen(false)}>
                <div className="w-6 h-6 rounded-full bg-bg-input flex items-center justify-center overflow-hidden shrink-0">
                  {userInfo.avatar ? (
                    <img src={userInfo.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={12} className="text-text-tertiary" />
                  )}
                </div>
                {userInfo.nickname || "Profile"}
              </Link>
            ) : (
              <Link href="/sign" className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-text-tertiary hover:text-text-primary rounded-lg hover:bg-bg-hover transition-colors" onClick={() => setMobileOpen(false)}>
                <div className="w-6 h-6 rounded-full bg-bg-input flex items-center justify-center overflow-hidden shrink-0">
                  <User size={12} className="text-text-tertiary" />
                </div>
                {t("nav.login") || (locale === "zh" ? "登录" : "Log in")}
              </Link>
            )}
          </div>
        )}
      </div>

      <AddVideoModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={(videoId) => router.push(`/video/${videoId}`)}
      />

      <AddPersonModal
        open={addPersonOpen}
        onClose={() => setAddPersonOpen(false)}
        onSuccess={(personId) => router.push(`/person/${personId}`)}
      />

      <AddMusicModal
        open={addMusicOpen}
        onClose={() => setAddMusicOpen(false)}
        onSuccess={(id, type) => router.push(type === "album" ? `/music/album/${id}` : `/music`)}
      />

      {comingSoon && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-xl bg-[#111] border border-white/[0.08] text-sm text-white/80 shadow-elevated animate-fade-in">
          {locale === "zh" ? "开发中，敬请期待" : "Coming soon"}
        </div>
      )}
    </header>
  );
}
