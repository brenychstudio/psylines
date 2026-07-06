import type { AtmosphereTokens } from "./moodStops";

const numericTokenNames = new Set<keyof AtmosphereTokens>([
  "--glass-alpha",
  "--glass-border",
  "--grain-opacity",
  "--motion-depth",
]);

export function interpolateTokens(
  from: AtmosphereTokens,
  to: AtmosphereTokens,
  amount: number,
): AtmosphereTokens {
  const clampedAmount = Math.min(1, Math.max(0, amount));
  const next = { ...to };

  numericTokenNames.forEach((tokenName) => {
    const fromValue = Number.parseFloat(from[tokenName]);
    const toValue = Number.parseFloat(to[tokenName]);

    if (!Number.isFinite(fromValue) || !Number.isFinite(toValue)) return;

    next[tokenName] = String(fromValue + (toValue - fromValue) * clampedAmount);
  });

  return next;
}
