import Image from "next/image";
import Link from "next/link";
import { Film, Star, Tv } from "lucide-react";
import { posterUrl } from "@/lib/utils";

const showcaseItems = [
  {
    videoId: 1001,
    title: "权力的游戏",
    origin: "Game of Thrones",
    type: "tv" as const,
    year: "2011",
    rating: "9.2",
    genres: ["Sci-Fi", "剧情"],
    poster: "NVp2yzVEGjAW6rXJ",
  },
  {
    videoId: 1003,
    title: "怪奇物语",
    origin: "Stranger Things",
    type: "tv" as const,
    year: "2016",
    rating: "8.7",
    genres: ["Sci-Fi", "悬疑"],
    poster: "0lkE6Mze4nWDwvY8",
  },
  {
    videoId: 4255,
    title: "疯狂动物城",
    origin: "Zootopia",
    type: "movie" as const,
    year: "2016",
    rating: "8.0",
    genres: ["动画", "冒险"],
    poster: "x4YQvW1D1N8KXa0O",
  },
  {
    videoId: 6858,
    title: "星际穿越",
    origin: "Interstellar",
    type: "movie" as const,
    year: "2014",
    rating: "8.6",
    genres: ["Sci-Fi", "剧情"],
    poster: "gZy7LWQlMe8K2Ppn",
  },
];

type ShowcaseItem = (typeof showcaseItems)[number];

function ShowcaseCard({ item, index }: { item: ShowcaseItem; index: number }) {
  const poster = posterUrl(item.poster, "w342");

  return (
    <Link
      href={`/video/${item.videoId}`}
      className={`group block p-5 rounded-2xl bg-bg-card border border-border-primary hover:border-border-secondary transition-all duration-300 hover:shadow-elevated animate-fade-in stagger-${index + 1}`}
    >
      <div className="aspect-[2/3] rounded-xl bg-bg-hover mb-4 flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent z-10" />
        {poster ? (
          <Image
            src={poster}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          item.type === "tv" ? <Tv size={40} className="text-text-tertiary/30" /> : <Film size={40} className="text-text-tertiary/30" />
        )}
        <div className="absolute top-2 left-2 z-20">
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium ${item.type === "tv" ? "bg-blue-500/20 text-blue-300" : "bg-emerald-500/20 text-emerald-300"}`}>
            {item.type === "tv" ? "TV" : "Movie"}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 z-20">
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-500/20 text-amber-300">
            <Star size={8} /> {item.rating}
          </span>
        </div>
      </div>
      <h4 className="text-sm font-semibold text-text-primary group-hover:text-white transition-colors line-clamp-1">{item.title}</h4>
      <p className="text-xs text-text-tertiary line-clamp-1">{item.origin}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] text-text-tertiary">{item.year}</span>
        <div className="flex gap-1 flex-wrap">
          {item.genres.map((genre) => (
            <span key={genre} className="px-1.5 py-0.5 rounded text-[9px] bg-bg-hover text-text-tertiary">{genre}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function HomeTrending() {
  return showcaseItems.map((item, index) => (
    <ShowcaseCard key={item.videoId} item={item} index={index} />
  ));
}
