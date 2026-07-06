import { printCatalog } from "../commerce/prints";
import { works } from "./works";
import { series } from "./series";
import { exhibitions } from "./exhibitions";
import type { WorkItem, WorkRole, SeriesItem, ExhibitionItem, PrintProduct } from "./types";

export function getAllWorks(): WorkItem[] {
  return works;
}

export function getAllSeries(): SeriesItem[] {
  return [...series].sort((a, b) => a.order - b.order);
}

export function getAllExhibitions(): ExhibitionItem[] {
  return exhibitions;
}

export function getAllPrints(): PrintProduct[] {
  return printCatalog;
}

export function getFeaturedWorks(): WorkItem[] {
  return getPublicWorks()
    .filter((work) => work.role === "anchor" || work.role === "featured")
    .sort((a, b) => b.year - a.year);
}

export function getWorkBySlug(slug: string): WorkItem | null {
  return works.find((item) => item.slug === slug) ?? null;
}

export function getSeriesBySlug(slug: string): SeriesItem | null {
  return series.find((item) => item.slug === slug) ?? null;
}

export function getExhibitionBySlug(slug: string): ExhibitionItem | null {
  return exhibitions.find((item) => item.slug === slug) ?? null;
}

export function getPrintBySlug(slug: string): PrintProduct | null {
  return printCatalog.find((item) => item.slug === slug) ?? null;
}

export function getPrintByArtworkSlug(artworkSlug: string): PrintProduct | null {
  return printCatalog.find((item) => item.artworkSlug === artworkSlug) ?? null;
}

export function getRelatedWorksForSeries(seriesSlug: string): WorkItem[] {
  return works
    .filter((work) => work.series === seriesSlug)
    .sort((a, b) => b.year - a.year);
}

export function getWorksBySlugs(slugs: string[]): WorkItem[] {
  return slugs
    .map((slug) => works.find((item) => item.slug === slug) ?? null)
    .filter((item): item is WorkItem => item !== null);
}

export function getSiblingWorks(workSlug: string, seriesSlug?: string): WorkItem[] {
  if (!seriesSlug) return [];

  return works
    .filter((item) => item.slug !== workSlug && item.series === seriesSlug)
    .sort((a, b) => b.year - a.year);
}

export function getPublicWorks(): WorkItem[] {
  return works.filter((work) => work.visibility === "public");
}

export function getWorksByRole(role: WorkRole): WorkItem[] {
  return getPublicWorks()
    .filter((work) => work.role === role)
    .sort((a, b) => b.year - a.year);
}

export function getAnchorWorks(): WorkItem[] {
  return getWorksByRole("anchor");
}

export function getArchiveWorks(): WorkItem[] {
  return getPublicWorks()
    .filter((work) => work.role === "archive" || work.role === "featured" || work.role === "anchor")
    .sort((a, b) => b.year - a.year);
}

export function getStudyWorks(): WorkItem[] {
  return getWorksByRole("study");
}

export function getEditionCandidateWorks(): WorkItem[] {
  return getPublicWorks()
    .filter((work) => work.editionCandidate === true || work.role === "editionCandidate")
    .sort((a, b) => b.year - a.year);
}

export function getHomeFeaturedWorks(limit = 3): WorkItem[] {
  return getPublicWorks()
    .filter((work) => work.featuredOnHome === true)
    .sort((a, b) => b.year - a.year)
    .slice(0, limit);
}

export function getWorksFeaturedInArchive(): WorkItem[] {
  return getPublicWorks()
    .filter((work) => work.featuredInWorks === true)
    .sort((a, b) => b.year - a.year);
}

export function getPrimaryHomeWork(): WorkItem | null {
  return (
    getPublicWorks().find((work) => work.featuredOnHome === true && work.role === "anchor") ??
    getAnchorWorks()[0] ??
    getFeaturedWorks()[0] ??
    null
  );
}

export function getSecondaryHomeWorks(limit = 2): WorkItem[] {
  return getPublicWorks()
    .filter((work) => work.featuredOnHome === true && work.role !== "anchor")
    .sort((a, b) => b.year - a.year)
    .slice(0, limit);
}

export function getHomeCycleEntries() {
  return getAllSeries().slice(0, 3);
}
