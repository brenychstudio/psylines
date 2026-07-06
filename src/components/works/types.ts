export type WorkArchiveEntry = {
  id: string;
  slug: string;
  title: string;
  year: number;
  statement: string;
  seriesKey: string;
  seriesTitle: string;
  availableAsPrint: boolean;
  editionCandidate: boolean;
  aspect: "portrait" | "landscape" | "square";
  coverSrc: string | null;
};

export type WorkFilterItem = {
  key: string;
  label: string;
};
