import clarity from "@microsoft/clarity";

/** Admin and its sign-in: Clarity and Umami never run here, whatever the visitor chose. */
export const isPrivatePath = (pathname: string) => /^\/(admin|login)(\/|$)/i.test(pathname);

type ClarityQueue = (command: string, ...args: unknown[]) => void;
const clarityApi = () => (window as unknown as { clarity?: ClarityQueue }).clarity;

let clarityStarted = false;
export const isClarityRunning = () => clarityStarted;

/** Consent Mode v2: Microsoft requires the signal for visits from the EEA. Nothing here is advertising. */
export function startClarity(projectId: string) {
  if (clarityStarted) return;
  clarityStarted = true;
  clarity.init(projectId);
  clarityApi()?.("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
}

/** Withdrawn: tells Clarity and drops its first-party cookies. The caller then reloads the page. */
export function withdrawClarity() {
  clarityApi()?.("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
  clarityStarted = false;
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of ["_clck", "_clsk"]) {
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  }
}
