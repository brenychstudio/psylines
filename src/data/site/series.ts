import type { SeriesItem } from "./types";

export type ArtworkSeriesMood =
  | "metaBodies"
  | "nightWater"
  | "studies"
  | "independent";

export type ArtworkSeriesStatus =
  | "active"
  | "closed"
  | "studies"
  | "future";

export type ArtworkSeries = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  years: string;
  statement: string;
  shortLine: string;
  mood: ArtworkSeriesMood;
  atmosphereProfile: string;
  flagshipWorkSlugs: string[];
  selectedWorkSlugs: string[];
  order: number;
  status: ArtworkSeriesStatus;
};

export const artworkSeries: ArtworkSeries[] = [
  {
    id: "meta-bodies",
    slug: "meta-bodies",
    title: "Meta Bodies / Inner Structures",
    subtitle: "Bodies beyond identity, held as pressure, signal and internal route.",
    years: "2025-present",
    statement:
      "Meta Bodies gathers works created through the Body Manifestation Process, where the figure appears from charcoal gesture, acrylic membrane, color field and inner structure rather than portrait or identity.",
    shortLine: "Bodies emerging from gesture, pressure, membrane and internal route.",
    mood: "metaBodies",
    atmosphereProfile: "mt-3",
    flagshipWorkSlugs: ["mt-3"],
    selectedWorkSlugs: ["mt-3"],
    order: 1,
    status: "active",
  },
  {
    id: "night-water",
    slug: "night-water",
    title: "Night Water",
    subtitle: "A quieter field of reflection, lunar atmosphere and submerged signal.",
    years: "not specified",
    statement:
      "Night Water holds works connected to reflection, submerged signal, nocturnal silence and slower atmospheric states.",
    shortLine: "Lunar silence, reflection and submerged signal.",
    mood: "nightWater",
    atmosphereProfile: "quiet-red-interval",
    flagshipWorkSlugs: [],
    selectedWorkSlugs: [],
    order: 2,
    status: "future",
  },
  {
    id: "studies",
    slug: "studies",
    title: "Studies / Fragments",
    subtitle: "Fragments, paper, raw material logic and early states of manifestation.",
    years: "not specified",
    statement:
      "Studies / Fragments gathers raw process states, material tests, paper logic and partial manifestations without reducing finished works to sketch logic.",
    shortLine: "Fragments, process states and raw material logic.",
    mood: "studies",
    atmosphereProfile: "figure-in-ash-light",
    flagshipWorkSlugs: [],
    selectedWorkSlugs: [],
    order: 3,
    status: "studies",
  },
];

export function getSeriesById(seriesId?: string | null): ArtworkSeries | null {
  if (!seriesId) return null;
  return artworkSeries.find((series) => series.id === seriesId) ?? null;
}

export function getSeriesBySlug(slug?: string | null): ArtworkSeries | null {
  if (!slug) return null;
  return artworkSeries.find((series) => series.slug === slug) ?? null;
}

// Legacy route data used by the current /series views. Keep this export stable
// until the chapter routes are intentionally migrated to artworkSeries.
export const series: SeriesItem[] = [
  {
    slug: "meta-bodies-inner-structures",
    title: "Meta Bodies / Inner Structures",
    subtitle:
      "Mutable forms, inner routes, and presence carried through non-literal bodies.",
    cover: "/images/series/p-1.jpg",
    description:
      "A core cycle where human-like forms remain unresolved: signal-bearing structures, internal pathways, and states of emergence rather than portrait identity.",
    order: 1,
    aspect: "portrait",

    headline: "Meta bodies emerge as presences, not representations.",
    intro:
      "This cycle gathers forms that may appear bodily, yet do not resolve into human identity. Internal structures act as routes, coded tensions, and carriers of manifestation rather than descriptive anatomy.",
    keywords: ["manifestation", "inner structures", "signal over identity"],
    spotlightWorkSlug: "figure-in-ash-light",
    subsetWorkSlugs: ["mt-1", "mt-2", "mt-3", "mt-4", "mt-5"],
    closingNote:
      "These works do not describe a body. They hold the moment in which form becomes temporarily visible as pressure, route, and presence.",
    relatedRoutes: {
      works: "/works",
      artist: "/artist",
      editions: "/prints",
      nextCycleSlug: "night-water-moonwater",
    },
  },
  {
    slug: "night-water-moonwater",
    title: "Night Water / Moonwater",
    subtitle:
      "Nocturnal water states, lunar drift, and bodies at the edge of appearance.",
    cover: "/images/series/p-2.jpg",
    description:
      "A field of submerged transitions: dark water, reflected light, and figures that register as passing presences within liquid space.",
    order: 2,
    aspect: "portrait",

    headline: "A quieter field of immersion, drift, and disappearance.",
    intro:
      "Moonwater gathers works where the body loosens into darker atmospheres of suspension, reflection, and submersion. These manifestations move with less pressure and more drift.",
    keywords: ["immersion", "lunar drift", "submerged presence"],
    spotlightWorkSlug: "mt-9",
    subsetWorkSlugs: ["mt-9"],
    closingNote:
      "This field is less declarative. Forms arrive through soft pressure, partial visibility, and the unstable meeting of surface and depth.",
    relatedRoutes: {
      works: "/works",
      artist: "/artist",
      editions: "/prints",
      nextCycleSlug: "studies-fragments",
    },
  },
  {
    slug: "studies-fragments",
    title: "Studies / Fragments",
    subtitle:
      "Fragments, gesture notes, and concentrated tests of the wider system.",
    cover: "/images/series/p-3.jpg",
    description:
      "A fragmentary cycle of studies where motifs compress into smaller signals, revealing process, pressure, and structural decisions in real time.",
    order: 3,
    aspect: "portrait",

    headline: "Fragments, studies, and partial signals of the same field.",
    intro:
      "These works are not secondary leftovers but compressed records of process, tension, and structural decision. They hold the practice in a lighter, more provisional register.",
    keywords: ["fragments", "partial signals", "process states"],
    spotlightWorkSlug: "mt-8",
    subsetWorkSlugs: ["mt-6", "mt-7", "mt-11"],
    closingNote:
      "Studies and fragments remain part of the same authored field. They reveal process without reducing the work to draft or sketch logic.",
    relatedRoutes: {
      works: "/works",
      artist: "/artist",
      editions: "/prints",
      nextCycleSlug: "meta-bodies-inner-structures",
    },
  },
];
