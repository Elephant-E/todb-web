export function useDetailColors(hasBackdrop: boolean) {
  return {
    h1: hasBackdrop ? "text-white" : "text-text-primary",
    sub: hasBackdrop ? "text-white/50" : "text-text-tertiary",
    meta: hasBackdrop ? "text-white/60" : "text-text-tertiary",
    metaHi: hasBackdrop ? "text-white/80" : "text-text-secondary",
    tag: hasBackdrop ? "bg-white/10 text-white/70" : "bg-bg-hover text-text-secondary",
    link: hasBackdrop ? "bg-white/10 text-white/70 hover:text-white" : "bg-bg-hover text-text-secondary hover:text-text-primary",
    icon: hasBackdrop ? "text-white/40 hover:text-white/70" : "text-text-tertiary hover:text-text-secondary",
    posterBg: hasBackdrop ? "bg-white/6" : "bg-bg-card",
    posterIc: hasBackdrop ? "text-white/30" : "text-text-tertiary",
    posterB: hasBackdrop ? "border-white/10" : "",
  };
}