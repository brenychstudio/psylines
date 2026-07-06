export type EditionType =
  | "original"
  | "limited-print"
  | "studio-print"
  | "inquiry-only";

export type AcquisitionMode = "checkout" | "inquiry" | "mixed";

export type CommerceOption = {
  label: string;
  sizeKey: string;
  dimensions: string;
  priceEUR: number;

  type: EditionType;
  editionSize?: number;
  editionNumberLabel?: string;

  paper?: string;
  printMethod?: string;
  signed?: boolean;
  certificateIncluded?: boolean;
  framedOption?: boolean;

  productionTime?: string;
  returnWindow?: string;
  shippingNote?: string;
};

export type CommerceProduct = {
  workSlug: string;
  workTitle: string;
  imageUrl?: string;
  acquisitionMode: AcquisitionMode;
  collectorNote?: string;
  options: CommerceOption[];
};

export const COMMERCE_CATALOG: Record<string, CommerceProduct> = {
  "mt-3": {
    workSlug: "mt-3",
    workTitle: "MT-3",
    acquisitionMode: "mixed",
    collectorNote:
      "Available as signed pigment prints in selected formats or as the original A3 work.",
    options: [
      {
        label: "30 x 40",
        sizeKey: "30x40",
        dimensions: "30 x 40 cm",
        priceEUR: 220,
        type: "limited-print",
        editionSize: 30,
        editionNumberLabel: "Limited edition of 30",
        paper: "Archival fine-art paper",
        printMethod: "Pigment print from original artwork",
        signed: true,
        certificateIncluded: true,
        framedOption: false,
        productionTime: "3-7 business days",
        returnWindow: "14 days",
        shippingNote: "Spain 1-3 days / EU 3-7 days / Worldwide 5-14 days",
      },
      {
        label: "50 x 70",
        sizeKey: "50x70",
        dimensions: "50 x 70 cm",
        priceEUR: 390,
        type: "limited-print",
        editionSize: 30,
        editionNumberLabel: "Limited edition of 30",
        paper: "Archival fine-art paper",
        printMethod: "Pigment print from original artwork",
        signed: true,
        certificateIncluded: true,
        framedOption: false,
        productionTime: "3-7 business days",
        returnWindow: "14 days",
        shippingNote: "Spain 1-3 days / EU 3-7 days / Worldwide 5-14 days",
      },
      {
        label: "70 x 100",
        sizeKey: "70x100",
        dimensions: "70 x 100 cm",
        priceEUR: 620,
        type: "limited-print",
        editionSize: 30,
        editionNumberLabel: "Limited edition of 30",
        paper: "Archival fine-art paper",
        printMethod: "Pigment print from original artwork",
        signed: true,
        certificateIncluded: true,
        framedOption: false,
        productionTime: "3-7 business days",
        returnWindow: "14 days",
        shippingNote: "Spain 1-3 days / EU 3-7 days / Worldwide 5-14 days",
      },
      {
        label: "Original",
        sizeKey: "original",
        dimensions: "A3 / 29.7 x 42 cm",
        priceEUR: 850,
        type: "original",
        editionNumberLabel: "One-of-one original work",
        paper: "Original artwork surface",
        printMethod: "Original work",
        signed: true,
        certificateIncluded: true,
        framedOption: false,
        productionTime: "Dispatch timing confirmed after purchase",
        returnWindow: "Reviewed individually",
        shippingNote: "Collector-grade handling. Shipping route confirmed after purchase.",
      },
    ],
  },
};

export function getCommerceProduct(workSlug: string) {
  return COMMERCE_CATALOG[workSlug] ?? null;
}

export function getCommerceOption(workSlug: string, sizeKey: string) {
  const product = getCommerceProduct(workSlug);
  if (!product) return null;
  return product.options.find((option) => option.sizeKey === sizeKey) ?? null;
}

export function getDefaultCommerceOption(workSlug: string) {
  const product = getCommerceProduct(workSlug);
  if (!product) return null;

  return (
    product.options.find((option) => option.sizeKey === "original") ??
    product.options[0] ??
    null
  );
}

export function getCommerceOptionTypeLabel(option: CommerceOption) {
  if (option.type === "original") return "Original work";
  if (option.type === "limited-print") return "Limited edition print";
  if (option.type === "studio-print") return "Studio print";
  return "Inquiry only";
}

export function getCommerceOptionProofLine(option: CommerceOption) {
  const parts = [
    getCommerceOptionTypeLabel(option),
    option.editionNumberLabel,
    option.signed ? "Signed" : null,
    option.certificateIncluded ? "Certificate included" : null,
  ].filter(Boolean);

  return parts.join(" / ");
}

export function getCommerceOptionMaterialLine(option: CommerceOption) {
  const parts = [option.printMethod, option.paper].filter(Boolean);
  return parts.join(" / ");
}
