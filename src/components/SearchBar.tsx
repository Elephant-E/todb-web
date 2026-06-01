"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  onSearch?: (value: string) => void;
  large?: boolean;
}

export function SearchBar({ placeholder = "搜索影视...", initialValue = "", onSearch, large }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const triggerSearch = useCallback((v: string) => {
    if (onSearch) {
      onSearch(v);
    } else {
      if (v) {
        router.push(`/browse?title=${encodeURIComponent(v)}`);
      } else {
        router.push("/browse");
      }
    }
  }, [onSearch, router]);

  const handleChange = (v: string) => {
    setValue(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      triggerSearch(v.trim());
    }, 300);
  };

  const handleClear = () => {
    setValue("");
    if (timerRef.current) clearTimeout(timerRef.current);
    triggerSearch("");
    inputRef.current?.focus();
  };

  const sizeClass = large
    ? "h-14 px-6 text-base"
    : "h-10 px-4 text-sm";

  return (
    <div className="relative w-full max-w-xl">
      <div
        className={`flex items-center gap-2.5 ${sizeClass} rounded-full bg-bg-input`}
      >
        <Search size={large ? 18 : 15} className="text-text-primary shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-tertiary"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <X size={14} />
          </button>
        )}
        {!large && !focused && !value && (
          <kbd className="text-[10px] text-text-tertiary bg-bg-primary px-1.5 py-0.5 rounded border border-border-primary">
            ⌘K
          </kbd>
        )}
      </div>
    </div>
  );
}
