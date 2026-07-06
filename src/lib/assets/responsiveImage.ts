import { existsSync } from "node:fs";
import { join } from "node:path";

import { resolvePublicAsset } from "./publicAsset";

type ResponsiveImageOptions = {
  widths?: readonly number[];
  defaultWidth?: number;
};

type ResponsiveImage = {
  src: string;
  srcset?: string;
};

const DEFAULT_WIDTHS = [640, 960, 1400, 2000] as const;
const DEFAULT_WIDTH = 1400;
const OPTIMIZABLE_IMAGE_PATTERN = /\.(jpe?g|png)$/i;
const generatedExistsCache = new Map<string, boolean>();
const responsiveImageCache = new Map<string, ResponsiveImage>();

function toNormalizedPublicPath(assetPath: string) {
  return assetPath.replace(/^\/+/, "").replace(/\\/g, "/");
}

function publicFileExists(publicPath: string) {
  const absolutePath = join(process.cwd(), "public", toNormalizedPublicPath(publicPath));
  const cachedExists = generatedExistsCache.get(absolutePath);
  const exists = cachedExists ?? existsSync(absolutePath);

  if (cachedExists === undefined) {
    generatedExistsCache.set(absolutePath, exists);
  }

  return exists;
}

function getGeneratedImagePath(assetPath: string, width: number) {
  const normalized = toNormalizedPublicPath(assetPath);
  const extensionless = normalized.replace(/\.[^.]+$/, "");
  return `/generated/${extensionless}-${width}.webp`;
}

export function getResponsivePublicImage(
  assetPath?: string | null,
  options: ResponsiveImageOptions = {},
): ResponsiveImage {
  const fallback = resolvePublicAsset(assetPath) ?? assetPath ?? "";
  const widths = options.widths ?? DEFAULT_WIDTHS;
  const defaultWidth = options.defaultWidth ?? DEFAULT_WIDTH;
  const cacheKey = `${fallback}|${defaultWidth}|${widths.join(",")}`;
  const cachedImage = responsiveImageCache.get(cacheKey);

  if (cachedImage) {
    return cachedImage;
  }

  if (!fallback || !OPTIMIZABLE_IMAGE_PATTERN.test(fallback)) {
    const image = { src: fallback };
    responsiveImageCache.set(cacheKey, image);
    return image;
  }

  const candidates = widths
    .map((width) => ({
      width,
      src: getGeneratedImagePath(fallback, width),
    }))
    .filter((candidate) => publicFileExists(candidate.src));

  if (candidates.length === 0) {
    const image = { src: fallback };
    responsiveImageCache.set(cacheKey, image);
    return image;
  }

  const preferred =
    candidates.find((candidate) => candidate.width >= defaultWidth) ??
    candidates[candidates.length - 1];

  const image = {
    src: preferred.src,
    srcset: candidates.map((candidate) => `${candidate.src} ${candidate.width}w`).join(", "),
  };

  responsiveImageCache.set(cacheKey, image);
  return image;
}
