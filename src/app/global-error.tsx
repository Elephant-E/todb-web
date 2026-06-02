"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
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
    console.error("Global app error:", error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body>
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-bg-primary px-6 text-center text-text-primary">
          <div className="mb-6 rounded-full bg-danger/10 p-6">
            <AlertTriangle className="h-16 w-16 text-danger" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">抱歉，应用出现了一些问题</h1>
          <p className="mb-8 max-w-md text-text-secondary">
            页面加载时发生了意外错误。您可以尝试重试，或稍后再访问。
          </p>

          {errorDetail && (
            <div className="mb-8 w-full max-w-md overflow-auto rounded border border-border-primary bg-bg-secondary p-4 text-left">
              <p className="break-words font-mono text-sm text-text-tertiary">
                {errorDetail}
              </p>
            </div>
          )}

          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <RefreshCcw className="h-4 w-4" />
            重试
          </button>
        </main>
      </body>
    </html>
  );
}
