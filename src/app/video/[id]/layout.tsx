import type { Metadata } from "next";
import { metadataApi } from "@/lib/metadata-api";
import { posterUrl, backdropUrl } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
};

const fallbackMetadata: Metadata = {
  title: "Video Detail",
  description: "Video metadata detail page on Todb.",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const videoId = Number(id);

  if (!Number.isInteger(videoId) || videoId <= 0) {
    return fallbackMetadata;
  }

  try {
    const video = await metadataApi.videoDetail(videoId);

    const title = video.video_title || video.origin_title;
    const description = video.video_description || video.tagline || `Metadata for ${title}`;
    const images: NonNullable<NonNullable<Metadata["openGraph"]>["images"]> = [];

    if (video.image_poster) {
      const url = posterUrl(video.image_poster, "w500");
      if (url) images.push({ url, width: 500, height: 750, alt: title });
    }
    if (video.image_backdrop) {
      const url = backdropUrl(video.image_backdrop, "w1280");
      if (url) images.push({ url, width: 1280, height: 720, alt: title });
    }

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: video.video_type === "movie" ? "video.movie" : "video.other",
        ...(images.length > 0 ? { images } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(images.length > 0 ? { images } : {}),
      },
    };
  } catch {
    return fallbackMetadata;
  }
}

export default function VideoDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
