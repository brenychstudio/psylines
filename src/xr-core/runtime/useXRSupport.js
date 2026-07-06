import { useEffect, useState } from "react";

export async function isImmersiveVRSupported() {
  try {
    const xr = typeof navigator !== "undefined" ? navigator.xr : null;
    if (!xr || !xr.isSessionSupported) return false;
    return await xr.isSessionSupported("immersive-vr");
  } catch {
    return false;
  }
}

export function useXRSupport() {
  const [xrSupported, setXRSupported] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkSupport() {
      const supported = await isImmersiveVRSupported();
      if (!cancelled) {
        setXRSupported(Boolean(supported));
      }
    }

    checkSupport();

    return () => {
      cancelled = true;
    };
  }, []);

  return xrSupported;
}
