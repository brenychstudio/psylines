import { printCatalog, type PrintProduct } from "../../data/commerce/prints";
import type { WorkItem } from "../../data/site/works";

export function getPrintByArtworkSlug(artworkSlug: string): PrintProduct | null {
  return printCatalog.find((item) => item.artworkSlug === artworkSlug) ?? null;
}

export function getPrintBySlug(printSlug: string): PrintProduct | null {
  return printCatalog.find((item) => item.slug === printSlug) ?? null;
}

export function getRelatedWorksForSeries(works: WorkItem[], seriesSlug: string) {
  return works
    .filter((work) => work.series === seriesSlug)
    .sort((a, b) => b.year - a.year);
}

export function getFeaturedWorks(works: WorkItem[]) {
  return [...works].sort((a, b) => {
    if (a.featured !== b.featured) {
      return Number(b.featured) - Number(a.featured);
    }
    return b.year - a.year;
  });
}
