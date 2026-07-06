import { works } from "./works";
import { getArtworkMeta } from "./artworkMeta";
import { getSeriesById, getSeriesBySlug } from "./series";

export type EnrichedArtwork = (typeof works)[number] & {
  meta: ReturnType<typeof getArtworkMeta>;
  series: ReturnType<typeof getSeriesById>;
};

export function getEnrichedArtworks(): EnrichedArtwork[] {
  return works.map((work) => {
    const meta = getArtworkMeta(work.slug);

    return {
      ...work,
      meta,
      series: getSeriesById(meta.seriesId),
    };
  });
}

export function getSelectedArtworks(): EnrichedArtwork[] {
  return getEnrichedArtworks()
    .filter((work) => work.meta.isSelected)
    .sort((a, b) => (a.meta.selectedRank ?? 999) - (b.meta.selectedRank ?? 999));
}

export function getFlagshipArtworks(): EnrichedArtwork[] {
  return getEnrichedArtworks().filter((work) => work.meta.isFlagship);
}

export function getStandaloneArtworks(): EnrichedArtwork[] {
  return getEnrichedArtworks().filter((work) => work.meta.isStandalone);
}

export function getHomeManifestationFieldWorks(limit = 8): EnrichedArtwork[] {
  const allWorks = getEnrichedArtworks();

  const selected = allWorks
    .filter((work) => work.meta.isSelected)
    .sort((a, b) => (a.meta.selectedRank ?? 999) - (b.meta.selectedRank ?? 999));

  const flagship = allWorks.filter(
    (work) =>
      work.meta.isFlagship &&
      !selected.some((selectedWork) => selectedWork.slug === work.slug),
  );

  const seriesWorks = allWorks.filter(
    (work) =>
      work.meta.seriesId &&
      !selected.some((selectedWork) => selectedWork.slug === work.slug) &&
      !flagship.some((flagshipWork) => flagshipWork.slug === work.slug),
  );

  const standalone = allWorks.filter(
    (work) =>
      work.meta.isStandalone &&
      !selected.some((selectedWork) => selectedWork.slug === work.slug) &&
      !flagship.some((flagshipWork) => flagshipWork.slug === work.slug) &&
      !seriesWorks.some((seriesWork) => seriesWork.slug === work.slug),
  );

  return [...selected, ...flagship, ...seriesWorks, ...standalone].slice(0, limit);
}

export function getSeriesArtworks(seriesId: string): EnrichedArtwork[] {
  return getEnrichedArtworks()
    .filter((work) => work.meta.seriesId === seriesId)
    .sort((a, b) => (a.meta.seriesOrder ?? 999) - (b.meta.seriesOrder ?? 999));
}

export function getArtworksBySeriesSlug(seriesSlug?: string | null): EnrichedArtwork[] {
  if (!seriesSlug) return getEnrichedArtworks();

  const series = getSeriesBySlug(seriesSlug);
  if (!series) return [];

  return getSeriesArtworks(series.id);
}

export function getSeriesContextFromSlug(seriesSlug?: string | null) {
  if (!seriesSlug) {
    return {
      series: null,
      works: getEnrichedArtworks(),
      isFiltered: false,
      isValidSeries: true,
    };
  }

  const series = getSeriesBySlug(seriesSlug);
  if (!series) {
    return {
      series: null,
      works: [],
      isFiltered: true,
      isValidSeries: false,
    };
  }

  return {
    series,
    works: getSeriesArtworks(series.id),
    isFiltered: true,
    isValidSeries: true,
  };
}

export function getWorksNeedingAuthorReview(): EnrichedArtwork[] {
  return getEnrichedArtworks().filter(
    (work) =>
      work.meta.contentStatus !== "complete" ||
      work.meta.yearStatus === "needs_author_review",
  );
}
