import type { Metadata } from "next";
import { metadataApi } from "@/lib/metadata-api";
import { profileUrl } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
};

const fallbackMetadata: Metadata = {
  title: "Person Detail",
  description: "Person metadata detail page on Todb.",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const personId = Number(id);

  if (!Number.isInteger(personId) || personId <= 0) {
    return fallbackMetadata;
  }

  try {
    const person = await metadataApi.personInfo(personId);

    const title = person.name || person.original_name || "Person Detail";
    const description = person.biography || `Metadata for ${title}`;
    const images: NonNullable<NonNullable<Metadata["openGraph"]>["images"]> = [];

    if (person.image_profile) {
      const url = profileUrl(person.image_profile, "h632");
      if (url) images.push({ url, width: 421, height: 632, alt: title });
    }

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "profile",
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

export default function PersonDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
