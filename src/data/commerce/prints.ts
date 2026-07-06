import type { PrintProduct } from "../site/types";

export const printCatalog: PrintProduct[] = [
  {
    id: "print-figure-in-ash-light",
    slug: "figure-in-ash-light",
    title: "Figure in Ash Light",
    artworkSlug: "figure-in-ash-light",
    aspect: "portrait",
    edition: "Limited edition of 15 + 2 AP",
    certificate: "Signed certificate of authenticity included",
    paper: "Hahnemuhle Photo Rag",
    leadTime: "2-3 weeks production and dispatch",
    shippingNote: "Rolled shipment in protective tube. Framing handled separately.",
    options: [
      { label: "Small", dimensions: "40 x 60 cm", priceEUR: 380 },
      { label: "Medium", dimensions: "70 x 100 cm", priceEUR: 820 },
      { label: "Large", dimensions: "90 x 120 cm", priceEUR: 1280 },
    ],
  },
  {
    id: "print-quiet-red-interval",
    slug: "quiet-red-interval",
    title: "Quiet Red Interval",
    artworkSlug: "quiet-red-interval",
    aspect: "portrait",
    edition: "Limited edition of 12 + 2 AP",
    certificate: "Signed certificate of authenticity included",
    paper: "Hahnemuhle Photo Rag",
    leadTime: "2-3 weeks production and dispatch",
    shippingNote: "Rolled shipment in protective tube. Framing handled separately.",
    options: [
      { label: "Small", dimensions: "40 x 60 cm", priceEUR: 340 },
      { label: "Medium", dimensions: "70 x 100 cm", priceEUR: 760 },
      { label: "Large", dimensions: "90 x 120 cm", priceEUR: 1180 },
    ],
  },
];
