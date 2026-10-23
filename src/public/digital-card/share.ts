export type ShareResult = "shared" | "aborted" | "unavailable" | "error";
export type CopyResult = "copied" | "failed";

export const canNativeShare = () => typeof navigator !== "undefined" && typeof navigator.share === "function";

/**
 * Opens the device share sheet. navigator.share() is called synchronously, before any await,
 * so calling this directly inside a click / pointerup handler keeps the user activation.
 */
export function shareLink(data: { title: string; text: string; url: string }): Promise<ShareResult> {
  if (!canNativeShare()) return Promise.resolve("unavailable");
  let pending: Promise<void>;
  try {
    pending = navigator.share(data);
  } catch {
    return Promise.resolve("error");
  }
  return pending.then(
    () => "shared" as const,
    (e: unknown) => {
      const name = e instanceof DOMException ? e.name : "";
      if (name === "AbortError") return "aborted"; // the user closed the sheet: not an error
      if (name === "NotAllowedError" || name === "TypeError") return "unavailable";
      return "error";
    }
  );
}

/** Copies text; reports success only when a copy really happened. */
export async function copyText(text: string): Promise<CopyResult> {
  try {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return "copied";
    }
  } catch {
    /* fall back below */
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok ? "copied" : "failed";
  } catch {
    return "failed";
  }
}
