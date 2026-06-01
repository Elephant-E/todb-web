"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

const hiddenPaths = ["/api-docs", "/"];

export function ScrollToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!visible || hiddenPaths.includes(pathname)) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-40 w-10 h-10 rounded-full bg-bg-card border border-border-primary shadow-elevated flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all animate-fade-in"
    >
      <ArrowUp size={18} />
    </button>
  );
}
