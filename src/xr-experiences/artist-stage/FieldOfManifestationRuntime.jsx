import XRExperienceHost from "../../xr-core/runtime/XRExperienceHost.jsx";
import { artistStageXRController } from "./ArtistStageXRController.js";

export default function FieldOfManifestationRuntime({ fullScreen = false }) {
  return (
    <div
      style={{
        display: "grid",
        gap: "0.9rem",
        width: "100%",
        height: fullScreen ? "100%" : "min(78vh, 920px)",
        minHeight: fullScreen ? "100%" : "640px",
      }}
    >
      <XRExperienceHost
        mode="exhibition"
        options={artistStageXRController.options}
        autoStart={true}
        builderLoader={() => import("./buildArtistStageManifest.js")}
      />
    </div>
  );
}
