"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorDetail = process.env.NODE_ENV === "development"
    ? error.message || "Unknown error"
    : error.digest
      ? `Error digest: ${error.digest}`
      : null;

  useEffect(() => {
    console.error("App route error:", error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center px-6 text-center animate-fade-in">
      <div className="rounded-full bg-danger/10 p-6 mb-6">
        <AlertTriangle className="h-16 w-16 text-danger" />
      </div>
      <h1 className="text-3xl font-bold text-text-primary mb-2">抱歉，出现了一些问题</h1>
      <p className="text-text-secondary max-w-md mb-8">
        加载此页面时发生了意外错误。您可以尝试刷新页面或返回首页。
      </p>
      
      {errorDetail && (
        <div className="bg-bg-secondary border border-border-primary rounded p-4 w-full max-w-md mb-8 overflow-auto text-left">
          <p className="text-sm font-mono text-text-tertiary break-words">
            {errorDetail}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-white font-medium hover:bg-accent-hover transition-colors"
        >
          <RefreshCcw className="h-4 w-4" />
          重试
        </button>
        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 rounded-lg bg-bg-secondary border border-border-primary px-6 py-3 text-text-primary font-medium hover:bg-bg-hover transition-colors"
        >
          <Home className="h-4 w-4" />
          返回首页
        </Link>
      </div>
    </div>
  );
}
