// Site integration adapter. Canonical overlay runtime lives in src/modules/print-ar/.
export async function openSitePrintPreview(payload) {
  if (!payload) return null;

  if (
    typeof window !== "undefined" &&
    window.__PRINT_AR_PREVIEW__ &&
    typeof window.__PRINT_AR_PREVIEW__.open === "function"
  ) {
    return window.__PRINT_AR_PREVIEW__.open(payload);
  }

  if (typeof window !== "undefined") {
    window.__PRINT_AR_LAST_PAYLOAD__ = payload;

    const dispatchOpenEvent = () => {
      window.dispatchEvent(
        new CustomEvent("print-ar-preview:open", {
          detail: payload,
        }),
      );
    };

    dispatchOpenEvent();

    [120, 360, 800].forEach((delay) => {
      window.setTimeout(() => {
        if (
          window.__PRINT_AR_PREVIEW__ &&
          typeof window.__PRINT_AR_PREVIEW__.open === "function"
        ) {
          window.__PRINT_AR_PREVIEW__.open(window.__PRINT_AR_LAST_PAYLOAD__ || payload);
          delete window.__PRINT_AR_LAST_PAYLOAD__;
          return;
        }

        dispatchOpenEvent();
      }, delay);
    });

    if (import.meta.env.DEV) {
      console.groupCollapsed("[Print AR Preview] bridge payload prepared");
      console.log(payload);
      console.groupEnd();
    }
  }

  return payload;
}
