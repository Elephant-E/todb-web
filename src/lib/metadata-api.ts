import type { PersonDetail, VideoDetail } from "@/types";

const METADATA_API_BASE = process.env.UPSTREAM_API_URL || "https://theotherdb.org/api";

async function getMetadata<T>(path: string): Promise<T> {
  const res = await fetch(`${METADATA_API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Metadata request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const metadataApi = {
  videoDetail: (videoId: number) => getMetadata<VideoDetail>(`/video/${videoId}`),
  personInfo: (personId: number) => getMetadata<PersonDetail>(`/person/${personId}/info`),
};
