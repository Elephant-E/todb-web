"use client";

import { CategoryPage } from "@/components/CategoryPage";
import { useLocale } from "@/components/LocaleProvider";

export default function MoviesPage() {
  const { t } = useLocale();
  return <CategoryPage videoType="movie" title={t("movies.title")} />;
}
