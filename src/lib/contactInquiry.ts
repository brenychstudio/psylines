export type CollectorInquiryPrefill = {
  context?: "collector" | "curatorial" | "studio";
  workTitle?: string | null;
  workSlug?: string | null;
  inventoryNumber?: string | null;
  seriesTitle?: string | null;
  seriesSlug?: string | null;
  routeLabel?: string | null;
  formatLabel?: string | null;
  dimensions?: string | null;
  priceLabel?: string | null;
  source?: string | null;
};

function setIfPresent(params: URLSearchParams, key: string, value: string | null | undefined) {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (normalized) {
    params.set(key, normalized);
  }
}

export function buildCollectorInquiryHref(prefill: CollectorInquiryPrefill) {
  const params = new URLSearchParams();

  params.set("context", prefill.context ?? "collector");
  setIfPresent(params, "work", prefill.workTitle ?? prefill.inventoryNumber);
  setIfPresent(params, "workSlug", prefill.workSlug);
  setIfPresent(params, "inventory", prefill.inventoryNumber);
  setIfPresent(params, "series", prefill.seriesTitle);
  setIfPresent(params, "seriesSlug", prefill.seriesSlug);
  setIfPresent(params, "route", prefill.routeLabel);
  setIfPresent(params, "format", prefill.formatLabel);
  setIfPresent(params, "dimensions", prefill.dimensions);
  setIfPresent(params, "price", prefill.priceLabel);
  setIfPresent(params, "source", prefill.source);

  const query = params.toString();
  return query ? `/contact?${query}` : "/contact";
}

export function readCollectorInquiryPrefill(searchParams: URLSearchParams): CollectorInquiryPrefill | null {
  const workTitle = searchParams.get("work");
  const workSlug = searchParams.get("workSlug");
  const inventoryNumber = searchParams.get("inventory");
  const seriesTitle = searchParams.get("series");
  const seriesSlug = searchParams.get("seriesSlug");
  const routeLabel = searchParams.get("route");
  const formatLabel = searchParams.get("format");
  const dimensions = searchParams.get("dimensions");
  const priceLabel = searchParams.get("price");
  const source = searchParams.get("source");
  const contextParam = searchParams.get("context");

  const hasContext =
    workTitle ||
    workSlug ||
    inventoryNumber ||
    seriesTitle ||
    seriesSlug ||
    routeLabel ||
    formatLabel ||
    dimensions ||
    priceLabel ||
    source;

  if (!hasContext) {
    return null;
  }

  return {
    context:
      contextParam === "curatorial" || contextParam === "studio"
        ? contextParam
        : "collector",
    workTitle,
    workSlug,
    inventoryNumber,
    seriesTitle,
    seriesSlug,
    routeLabel,
    formatLabel,
    dimensions,
    priceLabel,
    source,
  };
}

export function buildCollectorInquiryMailto(
  studioEmail: string,
  prefill: CollectorInquiryPrefill | null,
) {
  if (!prefill) {
    return `mailto:${studioEmail}?subject=ARTIST%20STAGE%20inquiry`;
  }

  const subjectTarget =
    prefill.inventoryNumber || prefill.workTitle || prefill.seriesTitle || "collector inquiry";
  const subject = `Rostyslav Brenych collector inquiry - ${subjectTarget}`;

  const lines = [
    "Hello,",
    "",
    "I would like to ask about the following work:",
    prefill.workTitle ? `Work: ${prefill.workTitle}` : null,
    prefill.inventoryNumber ? `Inventory: ${prefill.inventoryNumber}` : null,
    prefill.seriesTitle ? `Series: ${prefill.seriesTitle}` : null,
    prefill.routeLabel ? `Route: ${prefill.routeLabel}` : null,
    prefill.formatLabel ? `Format: ${prefill.formatLabel}` : null,
    prefill.dimensions ? `Dimensions: ${prefill.dimensions}` : null,
    prefill.priceLabel ? `Price context: ${prefill.priceLabel}` : null,
    "",
    "Please share availability, next steps, and any relevant collector context.",
  ].filter(Boolean);

  return `mailto:${studioEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}
