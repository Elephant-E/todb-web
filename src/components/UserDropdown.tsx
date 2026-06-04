"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { User, Settings, LogOut, Sun, Moon, Monitor, Code2 } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { clearAuthToken } from "@/lib/auth-token";

type Theme = "light" | "dark" | "system";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("theme") as Theme) || "system";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    root.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
}

interface UserDropdownProps {
  userInfo: {
    nickname?: string | null;
    avatar?: string | null;
    oauth_id?: string;
  } | null;
}

export function UserDropdown({ userInfo }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTheme(getStoredTheme());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  const handleThemeChange = (t: Theme) => {
    setTheme(t);
    localStorage.setItem("theme", t);
    applyTheme(t);
  };

  const handleLogout = () => {
    clearAuthToken();
    window.location.href = "/";
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-bg-input flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-border-secondary transition-all"
      >
        {userInfo?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element -- OAuth avatars may come from arbitrary external hosts.
          <img src={userInfo.avatar} alt="" className="w-full h-full object-cover" />
        ) : (
          <User size={16} className="text-text-tertiary" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-56 rounded-2xl bg-[rgba(10,10,10,0.72)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] shadow-elevated py-2 animate-scale-in">
          {userInfo && (
            <>
              <div className="mx-2 px-3 pt-2 pb-3">
                <div className="text-sm font-semibold text-white truncate">{userInfo.nickname || t("dropdown.user")}</div>
                <div className="text-xs text-white/40 truncate mt-0.5">ID: {userInfo.oauth_id}</div>
              </div>
              <div className="h-px bg-white/[0.08] mx-3" />
            </>
          )}


          <Link
            href="/api-docs"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Code2 size={16} className="text-white/40" />
            API
          </Link>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Settings size={16} className="text-white/40" />
            {t("dropdown.settings")}
          </Link>

          <div className="h-px bg-white/[0.08] mx-3" />

          <div className="flex items-center justify-between mx-2 px-3 py-2.5 rounded-lg">
            <span className="text-sm text-white/70">{t("dropdown.theme")}</span>
            <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
              {([
                { value: "light" as Theme, icon: Sun },
                { value: "dark" as Theme, icon: Moon },
                { value: "system" as Theme, icon: Monitor },
              ]).map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleThemeChange(value)}
                  className={`p-1.5 rounded-full transition-all ${
                    theme === value
                      ? "bg-white/30 text-white"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/[0.08] mx-3" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut size={16} className="text-white/40" />
            {t("dropdown.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
