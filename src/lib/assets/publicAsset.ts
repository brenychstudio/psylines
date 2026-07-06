import { existsSync } from "node:fs";
import { join } from "node:path";

const assetExistsCache = new Map<string, boolean>();

export function resolvePublicAsset(assetPath?: string | null): string | null {
  if (!assetPath) return null;

  const normalized = assetPath.replace(/^\/+/, "").replace(/\\/g, "/");
  const absolutePath = join(process.cwd(), "public", normalized);
  const cachedExists = assetExistsCache.get(absolutePath);
  const exists = cachedExists ?? existsSync(absolutePath);

  if (cachedExists === undefined) {
    assetExistsCache.set(absolutePath, exists);
  }

  return exists ? `/${normalized}` : null;
}
