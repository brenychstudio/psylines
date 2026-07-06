import {
  defaultArtworkAtmosphere,
  type ArtworkAtmosphereProfile,
} from "./artworkAtmosphereProfiles";

export function applyArtworkAtmosphere(
  profile: ArtworkAtmosphereProfile = defaultArtworkAtmosphere,
  target?: HTMLElement,
) {
  const root = target ?? (typeof document !== "undefined" ? document.documentElement : null);

  if (!root || !profile) return;

  root.style.setProperty("--artwork-wash", profile.wash);
  root.style.setProperty("--artwork-wash-strong", profile.washStrong);
  root.style.setProperty("--artwork-glow", profile.glow);
  root.style.setProperty("--artwork-shadow", profile.shadow);
  root.style.setProperty("--artwork-shadow-wash", profile.shadowWash);
  root.style.setProperty("--artwork-accent", profile.accent);
  root.style.setProperty("--artwork-pressure", profile.pressure);
  root.style.setProperty("--artwork-density", profile.density);
  root.style.setProperty("--artwork-field-opacity", profile.fieldOpacity);
  root.style.setProperty("--artwork-field-focused-opacity", profile.focusedOpacity);
  root.style.setProperty("--artwork-field-inspect-opacity", profile.inspectOpacity);
  root.dataset.artworkAtmosphere = profile.slug;
}

export function resetArtworkAtmosphere(target?: HTMLElement) {
  applyArtworkAtmosphere(defaultArtworkAtmosphere, target);
}
