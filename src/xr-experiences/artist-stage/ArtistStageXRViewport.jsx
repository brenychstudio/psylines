import { useEffect, useState } from "react";
import XRRootThree from "../../xr-core/runtime/XRRootThree.jsx";
import { useXRSupport } from "../../xr-core/runtime/useXRSupport.js";
import buildManifest from "./buildArtistStageManifest.js";
import { artistStageXRController } from "./ArtistStageXRController.js";

export default function ArtistStageXRViewport() {
  const xrSupported = useXRSupport();
  const [manifest, setManifest] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const nextManifest = await buildManifest();
        if (!cancelled) {
          setManifest(nextManifest);
          setStatus("ready");
        }
      } catch (error) {
        console.error("ArtistStageXRViewport manifest error:", error);
        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    boot();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center",
          background: "#04050a",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "0.55rem",
            justifyItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.14)",
              borderTopColor: "rgba(255,255,255,0.84)",
              animation: "artist-stage-spin 0.9s linear infinite",
            }}
          />
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(230,234,242,0.58)",
            }}
          >
            Preparing field
          </p>
        </div>

        <style>{`
          @keyframes artist-stage-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (status === "error" || !manifest) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center",
          background: "#04050a",
          color: "rgba(235,238,244,0.72)",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, maxWidth: "36ch", lineHeight: 1.6 }}>
          Unable to load the manifestation field.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#04050a",
      }}
    >
      <XRRootThree
        manifest={manifest}
        options={artistStageXRController.options}
        xrSupported={xrSupported}
      />
    </div>
  );
}

