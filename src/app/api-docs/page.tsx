"use client";

import { useState } from "react";
import { ChevronDown, Copy, Check } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";

interface Param {
  name: string;
  type: string;
  required: boolean;
  descKey: string;
}

interface EndpointDef {
  method: string;
  path: string;
  nameKey: string;
  descKey: string;
  params: Param[];
  responseExample?: string;
}

const endpointDefs: EndpointDef[] = [
  {
    method: "GET",
    path: "/video/search",
    nameKey: "search",
    descKey: "search",
    params: [
      { name: "video_type", type: "string", required: false, descKey: "videoType" },
      { name: "title", type: "string", required: false, descKey: "title" },
      { name: "year", type: "string", required: false, descKey: "year" },
      { name: "include_adult", type: "boolean", required: false, descKey: "includeAdult" },
      { name: "tmdb_id", type: "integer", required: false, descKey: "tmdbId" },
      { name: "imdb_id", type: "string", required: false, descKey: "imdbId" },
      { name: "page", type: "integer", required: false, descKey: "page" },
      { name: "page_size", type: "integer", required: false, descKey: "pageSize" },
    ],
    responseExample: `{
  "items": [
    {
      "video_id": 1,
      "video_title": "Inception",
      "origin_title": "Inception",
      "video_type": "movie",
      "date_air": "2010-07-16",
      "vote_average": 8.8,
      "image_poster": "/path.jpg",
      "image_backdrop": "/path.jpg"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20
}`,
  },
  {
    method: "GET",
    path: "/video/searchByTitle",
    nameKey: "searchByTitle",
    descKey: "searchByTitle",
    params: [
      { name: "title", type: "string", required: true, descKey: "title" },
      { name: "include_adult", type: "boolean", required: false, descKey: "includeAdult" },
      { name: "page", type: "integer", required: false, descKey: "page" },
      { name: "page_size", type: "integer", required: false, descKey: "pageSize" },
    ],
    responseExample: `{
  "items": [
    { "video_id": 1, "video_title": "Inception", "video_type": "movie", "date_air": "2010-07-16" }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20
}`,
  },
  {
    method: "GET",
    path: "/video/getVideoIdByExternalId",
    nameKey: "externalId",
    descKey: "externalId",
    params: [
      { name: "type", type: "string", required: true, descKey: "extIdType" },
      { name: "value", type: "string", required: true, descKey: "extIdValue" },
    ],
    responseExample: `{ "video_id": 1 }`,
  },
  {
    method: "GET",
    path: "/video/{video_id}/info",
    nameKey: "videoInfo",
    descKey: "videoInfo",
    params: [
      { name: "video_id", type: "integer", required: true, descKey: "videoId" },
    ],
    responseExample: `{
  "video_id": 1,
  "video_title": "Inception",
  "origin_title": "Inception",
  "video_type": "movie",
  "video_description": "A thief who steals corporate secrets...",
  "tagline": "Your mind is the scene of the crime",
  "date_air": "2010-07-16",
  "runtime": 148,
  "vote_average": 8.8,
  "vote_count": 35000,
  "is_adult": false,
  "image_poster": "/path.jpg",
  "image_backdrop": "/path.jpg",
  "origin_countrys": ["US", "GB"],
  "original_languages": ["en"],
  "external_ids": [
    { "type": "tmdb", "value": "27205" },
    { "type": "imdb", "value": "tt1375666" }
  ]
}`,
  },
  {
    method: "GET",
    path: "/video/{video_id}/season/{season_number}/info",
    nameKey: "seasonInfo",
    descKey: "seasonInfo",
    params: [
      { name: "video_id", type: "integer", required: true, descKey: "videoId" },
      { name: "season_number", type: "integer", required: true, descKey: "seasonNumber" },
    ],
    responseExample: `{
  "season_id": 1,
  "season_number": 1,
  "season_title": "第1季",
  "season_description": "",
  "date_air": "2008-01-20",
  "episode_count": 7,
  "vote_average": 8.5,
  "image_poster": "/path.jpg"
}`,
  },
  {
    method: "GET",
    path: "/video/{video_id}/allSeason",
    nameKey: "allSeason",
    descKey: "allSeason",
    params: [
      { name: "video_id", type: "integer", required: true, descKey: "videoId" },
    ],
    responseExample: `[
  { "season_id": 1, "season_number": 1, "season_title": "第1季", "date_air": "2008-01-20", "episode_count": 7 }
]`,
  },
  {
    method: "GET",
    path: "/video/{video_id}/season/{season_number}/episode/{episode_number}/info",
    nameKey: "episodeInfo",
    descKey: "episodeInfo",
    params: [
      { name: "video_id", type: "integer", required: true, descKey: "videoId" },
      { name: "season_number", type: "integer", required: true, descKey: "seasonNumber" },
      { name: "episode_number", type: "integer", required: true, descKey: "episodeNumber" },
    ],
    responseExample: `{
  "episode_id": 1,
  "episode_number": 1,
  "episode_title": "Pilot",
  "episode_description": "Walter White is diagnosed...",
  "date_air": "2008-01-20",
  "runtime": 58,
  "vote_average": 8.2,
  "image_poster": "/path.jpg"
}`,
  },
  {
    method: "GET",
    path: "/video/{video_id}/allEpisode",
    nameKey: "allEpisode",
    descKey: "allEpisode",
    params: [
      { name: "video_id", type: "integer", required: true, descKey: "videoId" },
    ],
    responseExample: `[
  { "episode_id": 1, "episode_number": 1, "episode_title": "Pilot", "date_air": "2008-01-20", "runtime": 58 }
]`,
  },
  {
    method: "GET",
    path: "/video/{video_id}/titles",
    nameKey: "titles",
    descKey: "titles",
    params: [
      { name: "video_id", type: "integer", required: true, descKey: "videoId" },
    ],
    responseExample: `[
  { "id": 1, "title": "盗梦空间", "is_lock": true },
  { "id": 2, "title": "Inception", "is_lock": false }
]`,
  },
  {
    method: "GET",
    path: "/video/{video_id}/genres",
    nameKey: "genres",
    descKey: "genres",
    params: [
      { name: "video_id", type: "integer", required: true, descKey: "videoId" },
    ],
    responseExample: `{
  "genre_ids": [1, 2, 3],
  "genres": [
    { "id": 1, "name": "动作" },
    { "id": 2, "name": "科幻" },
    { "id": 3, "name": "惊悚" }
  ]
}`,
  },
  {
    method: "GET",
    path: "/video/{video_id}/externalIds",
    nameKey: "externalIds",
    descKey: "externalIds",
    params: [
      { name: "video_id", type: "integer", required: true, descKey: "videoId" },
    ],
    responseExample: `[
  { "type": "tmdb", "value": "27205" },
  { "type": "imdb", "value": "tt1375666" },
  { "type": "homepage", "value": "https://example.com" }
]`,
  },
];

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.theotherdb.org";

function EndpointCard({ def }: { def: EndpointDef }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useLocale();
  const fullPath = `${baseUrl}${def.path}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(fullPath).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };

  const name = t(`apiDocs.endpoints.${def.nameKey}.name`);
  const desc = t(`apiDocs.endpoints.${def.descKey}.desc`);

  return (
    <div className="rounded-xl border border-border-primary overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-bg-hover transition-colors text-left"
      >
        <span className="px-2 py-0.5 rounded text-[11px] font-bold text-text-primary bg-text-primary/10">
          {def.method}
        </span>
        <span className="text-sm font-medium text-text-primary font-mono flex-1">{def.path}</span>
        <span className="text-xs text-text-tertiary pr-2">{name}</span>
        <ChevronDown size={14} className={`text-text-tertiary transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-border-primary px-4 py-4 space-y-4 animate-fade-in">
          <p className="text-xs text-text-secondary">{desc}</p>

          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-bg-input">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-text-primary bg-text-primary/10">{def.method}</span>
            <code className="text-xs text-text-primary font-mono flex-1 break-all">{fullPath}</code>
            <button onClick={handleCopy} className="text-text-tertiary hover:text-text-primary transition-colors shrink-0">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <span>{t("apiDocs.authLabel")}:</span>
            <span className="px-2 py-0.5 rounded bg-bg-hover text-text-secondary font-medium">Bearer Token</span>
          </div>

          {def.params.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-2">{t("apiDocs.params")}</h4>
              <div className="space-y-1">
                {def.params.map((p) => (
                  <div key={p.name} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-bg-input/50">
                    <span className="text-xs font-mono font-medium text-text-primary min-w-[120px]">{p.name}</span>
                    <span className="text-[10px] text-text-tertiary min-w-[50px]">{p.type}</span>
                    {p.required && <span className="text-[9px] font-bold text-text-primary bg-text-primary/10 px-1.5 py-0.5 rounded">{t("apiDocs.required")}</span>}
                    <span className="text-xs text-text-secondary flex-1">{t(`apiDocs.paramDesc.${p.descKey}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {def.responseExample && (
            <div>
              <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.06em] mb-2">{t("apiDocs.response") || "Response"}</h4>
              <pre className="text-xs text-text-primary font-mono bg-bg-input rounded-lg p-3 overflow-x-auto whitespace-pre leading-relaxed">{def.responseExample}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApiDocsPage() {
  const { t } = useLocale();

  return (
    <div className="pt-[72px] min-h-screen px-6">
      <div className="max-w-[960px] mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">{t("apiDocs.title")}</h1>
          <p className="text-sm text-text-tertiary">{t("apiDocs.subtitle")}</p>
        </div>

        <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl bg-bg-card border border-border-primary">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-text-secondary">{t("apiDocs.auth")}</span>
          <span className="text-xs text-text-tertiary ml-auto font-mono">{baseUrl}</span>
        </div>

        <div className="space-y-2">
          {endpointDefs.map((def) => (
            <EndpointCard key={def.path} def={def} />
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border-primary">
          <h2 className="text-lg font-semibold mb-4">{t("apiDocs.quickStart")}</h2>
          <div className="rounded-xl bg-bg-card border border-border-primary p-4">
            <code className="text-xs text-text-primary font-mono block">
              curl -H &quot;Authorization: Bearer YOUR_TOKEN&quot; https://api.theotherdb.org/video/search?title=Inception
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
