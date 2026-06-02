import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-text-tertiary">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-sm font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
