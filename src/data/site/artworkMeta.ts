import type { ArtworkSeriesMood } from "./series";
import {
  bodyManifestationMetadata,
  bodyManifestationProcess,
} from "./process";

export type ArtworkFormat = "A4" | "A3" | "A2" | "50x70" | "custom";

export type ArtworkOrientation = "portrait" | "landscape" | "square";

export type ArtworkAcquisitionStatus =
  | "available"
  | "inquiry"
  | "reserved"
  | "sold"
  | "not_for_sale";

export type ArtworkAcquisitionMode =
  | "checkout"
  | "inquiry"
  | "private";

export type ArtworkContentStatus =
  | "complete"
  | "needs_author_review"
  | "placeholder";

export type ArtworkMaterial =
  | "archival paper"
  | "charcoal"
  | "acrylic"
  | "acrylic medium"
  | "acrylic paint"
  | "charcoal pencil"
  | "graphite"
  | "pencil"
  | "mixed media"
  | "fixative"
  | "medium"
  | "surface treatment"
  | "experimental coating";

export type ArtworkMeta = {
  slug: string;

  inventoryNumber?: string;
  year?: number;
  yearStatus?: "confirmed" | "needs_author_review";

  seriesId?: string | null;
  seriesOrder?: number | null;

  isStandalone: boolean;
  isFlagship: boolean;
  isSelected: boolean;
  selectedRank?: number | null;

  format?: ArtworkFormat;
  dimensions?: string;
  orientation?: ArtworkOrientation;

  mediumLine: string;
  materials: ArtworkMaterial[];
  paper: string;
  surfaceTreatment?: string;
  technique?: string;
  techniqueNote?: string;
  primaryGesture?: string;
  surfaceLayer?: string;
  colorLayer?: string;
  finalLine?: string;
  referencePolicy?: string;
  processNote?: string;

  signature: "signed" | "not_specified";
  certificate: boolean;

  shortStatement?: string;
  story?: string;

  acquisitionStatus: ArtworkAcquisitionStatus;
  acquisitionMode: ArtworkAcquisitionMode;

  atmosphereProfile: string;
  mood?: ArtworkSeriesMood;

  contentStatus: ArtworkContentStatus;
};

export const defaultArtworkMeta: Omit<ArtworkMeta, "slug"> = {
  yearStatus: "needs_author_review",

  seriesId: null,
  seriesOrder: null,

  isStandalone: true,
  isFlagship: false,
  isSelected: false,
  selectedRank: null,

  format: "custom",
  dimensions: undefined,
  orientation: "portrait",

  mediumLine: bodyManifestationProcess.mediumLine,
  materials: [
    "archival paper",
    "charcoal",
    "acrylic medium",
    "acrylic paint",
    "charcoal pencil",
    "mixed media",
    "fixative",
  ],
  paper: "Archival fine-art paper",
  surfaceTreatment:
    "Fixed charcoal trace sealed with transparent acrylic medium before acrylic color and final charcoal-pencil structures.",
  technique: bodyManifestationMetadata.technique,
  techniqueNote: bodyManifestationProcess.shortDefinition,
  primaryGesture: bodyManifestationMetadata.primaryGesture,
  surfaceLayer: bodyManifestationMetadata.surfaceLayer,
  colorLayer: bodyManifestationMetadata.colorLayer,
  finalLine: bodyManifestationMetadata.finalLine,
  referencePolicy: bodyManifestationProcess.referencePolicy,
  processNote: bodyManifestationProcess.processNote,

  signature: "signed",
  certificate: true,

  acquisitionStatus: "inquiry",
  acquisitionMode: "inquiry",

  atmosphereProfile: "default",
  mood: "independent",

  contentStatus: "needs_author_review",
};

export const artworkMetaBySlug: Record<string, Partial<ArtworkMeta>> = {
  "mt-3": {
    slug: "mt-3",
    inventoryNumber: "MT-3",
    year: 2025,
    yearStatus: "confirmed",
    seriesId: "meta-bodies",
    seriesOrder: 3,
    isStandalone: false,
    isFlagship: true,
    isSelected: true,
    selectedRank: 1,
    format: "A3",
    dimensions: "29.7 x 42 cm",
    orientation: "portrait",
    acquisitionStatus: "available",
    acquisitionMode: "checkout",
    atmosphereProfile: "mt-3",
    mood: "metaBodies",
    contentStatus: "complete",
  },

  "mt-1": {
    slug: "mt-1",
    inventoryNumber: "MT-1",
    year: 2025,
    yearStatus: "confirmed",
    seriesId: "meta-bodies",
    seriesOrder: 1,
    isStandalone: false,
    isFlagship: false,
    isSelected: true,
    selectedRank: 2,
    format: "A3",
    orientation: "portrait",
    atmosphereProfile: "mt-1",
    mood: "metaBodies",
    contentStatus: "needs_author_review",
  },

  "mt-2": {
    slug: "mt-2",
    inventoryNumber: "MT-2",
    year: 2025,
    yearStatus: "confirmed",
    seriesId: "meta-bodies",
    seriesOrder: 2,
    isStandalone: false,
    isFlagship: false,
    isSelected: true,
    selectedRank: 3,
    format: "A3",
    orientation: "portrait",
    atmosphereProfile: "mt-2",
    mood: "metaBodies",
    contentStatus: "needs_author_review",
  },

  "mt-4": {
    slug: "mt-4",
    inventoryNumber: "MT-4",
    year: 2025,
    yearStatus: "confirmed",
    seriesId: "meta-bodies",
    seriesOrder: 4,
    isStandalone: false,
    isFlagship: false,
    isSelected: false,
    format: "A3",
    orientation: "portrait",
    atmosphereProfile: "mt-4",
    mood: "metaBodies",
    contentStatus: "needs_author_review",
  },

  "figure-in-ash-light": {
    slug: "figure-in-ash-light",
    inventoryNumber: "ASH-1",
    yearStatus: "needs_author_review",
    seriesId: null,
    seriesOrder: null,
    isStandalone: true,
    isFlagship: true,
    isSelected: true,
    selectedRank: 4,
    format: "custom",
    orientation: "portrait",
    atmosphereProfile: "figure-in-ash-light",
    mood: "independent",
    contentStatus: "needs_author_review",
  },

  "quiet-red-interval": {
    slug: "quiet-red-interval",
    inventoryNumber: "QRI-1",
    yearStatus: "needs_author_review",
    seriesId: null,
    isStandalone: true,
    isFlagship: false,
    isSelected: false,
    atmosphereProfile: "quiet-red-interval",
    mood: "independent",
    contentStatus: "needs_author_review",
  },

  "mt-5": {
    slug: "mt-5",
    inventoryNumber: "MT-5",
    year: 2025,
    yearStatus: "needs_author_review",
    seriesId: "meta-bodies",
    seriesOrder: 5,
    isStandalone: false,
    atmosphereProfile: "mt-5",
    mood: "metaBodies",
  },

  "mt-6": {
    slug: "mt-6",
    inventoryNumber: "MT-6",
    year: 2025,
    yearStatus: "needs_author_review",
    seriesId: "studies",
    seriesOrder: 1,
    isStandalone: false,
    atmosphereProfile: "default",
    mood: "studies",
  },

  "mt-7": {
    slug: "mt-7",
    inventoryNumber: "MT-7",
    year: 2025,
    yearStatus: "needs_author_review",
    seriesId: "studies",
    seriesOrder: 2,
    isStandalone: false,
    atmosphereProfile: "default",
    mood: "studies",
  },

  "mt-8": {
    slug: "mt-8",
    inventoryNumber: "MT-8",
    year: 2025,
    yearStatus: "needs_author_review",
    seriesId: "studies",
    seriesOrder: 3,
    isStandalone: false,
    atmosphereProfile: "default",
    mood: "studies",
  },

  "mt-9": {
    slug: "mt-9",
    inventoryNumber: "MT-9",
    year: 2025,
    yearStatus: "needs_author_review",
    seriesId: "night-water",
    seriesOrder: 1,
    isStandalone: false,
    atmosphereProfile: "quiet-red-interval",
    mood: "nightWater",
  },

  "mt-10": {
    slug: "mt-10",
    inventoryNumber: "MT-10",
    year: 2025,
    yearStatus: "needs_author_review",
    seriesId: "meta-bodies",
    seriesOrder: 10,
    isStandalone: false,
    atmosphereProfile: "default",
    mood: "metaBodies",
  },

  "mt-11": {
    slug: "mt-11",
    inventoryNumber: "MT-11",
    year: 2025,
    yearStatus: "needs_author_review",
    seriesId: "studies",
    seriesOrder: 4,
    isStandalone: false,
    atmosphereProfile: "default",
    mood: "studies",
  },
};

export function getArtworkMeta(slug: string): ArtworkMeta {
  const override = artworkMetaBySlug[slug] ?? { slug };

  return {
    slug,
    ...defaultArtworkMeta,
    ...override,
  };
}
