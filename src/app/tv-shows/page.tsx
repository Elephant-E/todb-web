"use client";

import { CategoryPage } from "@/components/CategoryPage";
import { useLocale } from "@/components/LocaleProvider";

export default function TVShowsPage() {
  const { t } = useLocale();
  return <CategoryPage videoType="tv" title={t("tvShows.title")} />;
}
