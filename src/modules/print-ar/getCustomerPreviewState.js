export function getCustomerPreviewState({
  mobileBridge,
  runtimeStatus,
  selectedFrameLabel,
} = {}) {
  const androidReady = Boolean(mobileBridge?.android?.canLaunchAttached);
  const iosReady = Boolean(mobileBridge?.ios?.canLaunchAttached);
  const platform = mobileBridge?.platform || "desktop";
  const interactiveReady = runtimeStatus === "ready";
  const mobilePreviewReady = androidReady || iosReady;

  let primaryAction = "none";
  let secondaryAction = "none";
  let previewStatus = "unavailable";
  let customerMessage = selectedFrameLabel
    ? `Preview unavailable for ${selectedFrameLabel.toLowerCase()} right now.`
    : "Preview unavailable right now.";

  if (androidReady) {
    primaryAction = "android";
    secondaryAction = iosReady ? "ios" : "none";
    previewStatus = "ready";
    customerMessage =
      platform === "android"
        ? "Preview ready."
        : "Preview ready for Android.";
  } else if (iosReady) {
    primaryAction = "ios";
    previewStatus = "partial";
    customerMessage =
      platform === "ios"
        ? "Preview ready."
        : "Preview available on iPhone/iPad.";
  } else if (interactiveReady) {
    previewStatus = "interactive";
    customerMessage =
      "Interactive 3D preview is ready. Mobile AR launch unlocks when this exact variant has attached assets.";
  }

  if (runtimeStatus === "loading" && previewStatus === "unavailable") {
    customerMessage = "Preparing 3D preview...";
  }

  return {
    hasPreview: interactiveReady || mobilePreviewReady,
    interactiveReady,
    mobilePreviewReady,
    androidReady,
    iosReady,
    primaryAction,
    secondaryAction,
    previewStatus,
    customerMessage,
  };
}
