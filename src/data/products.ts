export const PRODUCTS = {
  "mt-3": {
    title: "MT-3",
    prices: {
      "30x40": 22000,
      "50x70": 35000,
      "70x100": 52000,
    },
  },
} as const;

const SIZE_META = {
  "30x40": { label: "30 x 40", dimensions: "30 x 40 cm" },
  "50x70": { label: "50 x 70", dimensions: "50 x 70 cm" },
  "70x100": { label: "70 x 100", dimensions: "70 x 100 cm" },
} as const;

export type CatalogSizeKey = keyof typeof SIZE_META;

export type CatalogOption = {
  sizeKey: CatalogSizeKey;
  label: string;
  dimensions: string;
  priceCents: number;
  priceEUR: string;
};

export function normalizeSizeKey(raw: string | null | undefined): CatalogSizeKey | null {
  if (!raw) {
    return null;
  }

  const key = raw.toLowerCase().replace(/[^0-9x]/g, "");
  if (key === "30x40" || key === "50x70" || key === "70x100") {
    return key;
  }

  return null;
}

export function getCatalogOptions(workSlug: string): CatalogOption[] | null {
  const product = PRODUCTS[workSlug as keyof typeof PRODUCTS];
  if (!product) {
    return null;
  }

  return (Object.keys(product.prices) as CatalogSizeKey[]).map((sizeKey) => {
    const priceCents = product.prices[sizeKey];
    const meta = SIZE_META[sizeKey];
    return {
      sizeKey,
      label: meta.label,
      dimensions: meta.dimensions,
      priceCents,
      priceEUR: (priceCents / 100).toFixed(0),
    };
  });
}

export function getCatalogCheckoutData(workSlug: string, sizeKeyRaw: string | null | undefined) {
  const product = PRODUCTS[workSlug as keyof typeof PRODUCTS];
  const sizeKey = normalizeSizeKey(sizeKeyRaw);
  if (!product || !sizeKey) {
    return null;
  }

  const priceCents = product.prices[sizeKey];
  if (typeof priceCents !== "number") {
    return null;
  }

  const meta = SIZE_META[sizeKey];
  return {
    title: product.title,
    sizeKey,
    selectedSize: meta.label,
    dimensions: meta.dimensions,
    priceCents,
  };
}
