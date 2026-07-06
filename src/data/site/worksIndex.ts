import {
  getEnrichedArtworks,
  getSeriesContextFromSlug,
  type EnrichedArtwork,
} from "./artworkCollections";
import type { ArtworkSeries } from "./series";

export type WorksViewMode = "field" | "index";

export type WorksRegisterQuery =
  | "all"
  | "selected"
  | "flagship"
  | "standalone";

export type WorksIndexQuery = {
  view?: string | null;
  series?: string | null;
  register?: string | null;
  format?: string | null;
  orientation?: string | null;
  status?: string | null;
};

export type WorksIndexContext = {
  viewMode: WorksViewMode;
  register: WorksRegisterQuery;
  seriesSlug: string | null;
  series: ArtworkSeries | null;
  isSeriesFiltered: boolean;
  isValidSeries: boolean;
  allWorks: EnrichedArtwork[];
  filteredWorks: EnrichedArtwork[];
  fieldWorks: EnrichedArtwork[];
  indexWorks: EnrichedArtwork[];
  activeTitle: string;
  activeDescription: string;
  activeCountLabel: string;
  clearHref: string;
};

const FIELD_LIMIT = 12;

function normalizeView(view?: string | null): WorksViewMode {
  return view === "index" ? "index" : "field";
}

function normalizeRegister(register?: string | null): WorksRegisterQuery {
  if (
    register === "selected" ||
    register === "flagship" ||
    register === "standalone"
  ) {
    return register;
  }

  return "all";
}

function applyRegisterFilter(
  works: EnrichedArtwork[],
  register: WorksRegisterQuery,
): EnrichedArtwork[] {
  if (register === "selected") return works.filter((work) => work.meta.isSelected);
  if (register === "flagship") return works.filter((work) => work.meta.isFlagship);
  if (register === "standalone") return works.filter((work) => work.meta.isStandalone);

  return works;
}

function applyOptionalFilters(
  works: EnrichedArtwork[],
  query: WorksIndexQuery,
): EnrichedArtwork[] {
  return works.filter((work) => {
    if (query.format && work.meta.format !== query.format) return false;
    if (query.orientation && work.meta.orientation !== query.orientation) return false;
    if (query.status && work.meta.acquisitionStatus !== query.status) return false;

    return true;
  });
}

function getFieldWorks(works: EnrichedArtwork[]): EnrichedArtwork[] {
  const prioritized = [...works].sort((a, b) => {
    const selectedA = a.meta.isSelected ? 0 : 1;
    const selectedB = b.meta.isSelected ? 0 : 1;
    if (selectedA !== selectedB) return selectedA - selectedB;

    const flagshipA = a.meta.isFlagship ? 0 : 1;
    const flagshipB = b.meta.isFlagship ? 0 : 1;
    if (flagshipA !== flagshipB) return flagshipA - flagshipB;

    return (a.meta.seriesOrder ?? 999) - (b.meta.seriesOrder ?? 999);
  });

  return prioritized.slice(0, FIELD_LIMIT);
}

function sortIndexWorks(works: EnrichedArtwork[]): EnrichedArtwork[] {
  return [...works].sort((a, b) => {
    const seriesOrder = (a.meta.seriesOrder ?? 999) - (b.meta.seriesOrder ?? 999);
    if (seriesOrder !== 0) return seriesOrder;

    return b.year - a.year;
  });
}

function buildTitle(
  register: WorksRegisterQuery,
  series: ArtworkSeries | null,
): string {
  if (series) return series.title;
  if (register === "selected") return "Selected manifestations";
  if (register === "flagship") return "Flagship works";
  if (register === "standalone") return "Independent manifestations";

  return "All works";
}

function buildDescription(
  register: WorksRegisterQuery,
  series: ArtworkSeries | null,
): string {
  if (series) return series.shortLine;
  if (register === "selected") {
    return "Author-selected works from the current field.";
  }
  if (register === "flagship") {
    return "Key works that anchor the practice and series logic.";
  }
  if (register === "standalone") {
    return "Independent works outside confirmed series structures.";
  }

  return "A complete register of works, series, standalone manifestations and collector routes.";
}

export function getWorksIndexContext(query: WorksIndexQuery): WorksIndexContext {
  const viewMode = normalizeView(query.view);
  const register = normalizeRegister(query.register);
  const allWorks = sortIndexWorks(getEnrichedArtworks());

  const seriesContext = getSeriesContextFromSlug(query.series ?? null);

  let baseWorks = seriesContext.isFiltered ? seriesContext.works : allWorks;
  baseWorks = applyRegisterFilter(baseWorks, register);
  baseWorks = applyOptionalFilters(baseWorks, query);
  baseWorks = sortIndexWorks(baseWorks);

  const fieldWorks = getFieldWorks(baseWorks);
  const indexWorks = baseWorks;

  const activeTitle = buildTitle(register, seriesContext.series);
  const activeDescription = buildDescription(register, seriesContext.series);

  const activeCountLabel =
    baseWorks.length === 1
      ? "1 work"
      : `${baseWorks.length} works`;

  return {
    viewMode,
    register,
    seriesSlug: query.series ?? null,
    series: seriesContext.series,
    isSeriesFiltered: seriesContext.isFiltered,
    isValidSeries: seriesContext.isValidSeries,
    allWorks,
    filteredWorks: baseWorks,
    fieldWorks,
    indexWorks,
    activeTitle,
    activeDescription,
    activeCountLabel,
    clearHref: "/works",
  };
}
