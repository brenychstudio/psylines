export type MediaAspect = "portrait" | "landscape" | "square";

export type WorkRole =
  | "anchor"
  | "featured"
  | "archive"
  | "study"
  | "editionCandidate";

export type WorkVisibility = "public" | "hidden";

export type WorkItem = {
  id: string;
  slug: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  cover: string;
  statement: string;
  series?: string;
  featured: boolean;
  availableAsPrint: boolean;
  aspect: MediaAspect;

  role: WorkRole;
  visibility: WorkVisibility;
  featuredOnHome?: boolean;
  featuredInWorks?: boolean;
  editionCandidate?: boolean;
};

export type SeriesItem = {
  slug: string;
  title: string;
  subtitle?: string;
  cover: string;
  description: string;
  order: number;
  aspect: MediaAspect;

  headline: string;
  intro: string;
  keywords: string[];
  spotlightWorkSlug: string;
  subsetWorkSlugs: string[];
  closingNote: string;
  relatedRoutes: {
    works?: string;
    artist?: string;
    editions?: string;
    nextCycleSlug?: string;
  };
};

export type ExhibitionItem = {
  slug: string;
  title: string;
  location: string;
  period: string;
  cover: string;
  description: string;
  status: "past" | "current" | "upcoming";
  aspect: MediaAspect;
};

export type PrintOption = {
  label: string;
  dimensions: string;
  priceEUR: number;
};

export type PrintProduct = {
  id: string;
  slug: string;
  title: string;
  artworkSlug: string;
  aspect: MediaAspect;
  edition: string;
  certificate: string;
  paper: string;
  leadTime: string;
  shippingNote: string;
  options: PrintOption[];
};
