/**
 * One way out for every public MambyLy contact request (the wizard). Each valid request starts two
 * independent deliveries; neither waits for or falls back on the other, and neither is retried:
 *
 * API: the existing backend, POST {VITE_API_BASE_URL}/clientsMessages with
 * { name, email, subject, textMessage } – the same endpoint and payload as src/hooks/useSubmitMessage.ts.
 * The backend validates with Joi (name 2–100, email, subject 3–255, textMessage 10–2000), stores the
 * request in DynamoDB (the admin dashboard reads it) and answers 201 { success: true, messageId }.
 * It sends no e-mail.
 *
 * Formspree: the e-mail notification, POST {VITE_FORMSPREE_ENDPOINT} with
 * { name, email, subject, message }. Used only when the variable is a https://formspree.io/f/<id>
 * endpoint: development and the local demo have none. A positive answer means Formspree accepted the
 * request, not that the e-mail reached the inbox.
 *
 * Nothing here logs or stores what the visitor wrote.
 */
export type ContactRequest = { name: string; email: string; subject: string; message: string };

export type SubmitFailure =
  /** The service refused the data (400/422): the visitor can correct and send again. */
  | "invalid"
  /** Too many requests (429). */
  | "busy"
  /** The service answered with an error (other 4xx/5xx, or an unexpected answer). */
  | "server"
  /** No connection: nothing left the device. */
  | "offline"
  /** No answer in time: the request may or may not have arrived. */
  | "unknown";

export type SubmitResult = { ok: true; id?: string } | { ok: false; reason: SubmitFailure; status?: number };

/**
 * full: every configured delivery succeeded. api / formspree: only that one did, and the screen
 * says nothing about the other. failed: none did; the visitor keeps the answers and decides.
 */
export type DeliveryOutcome = { ok: true; delivered: "full" | "api" | "formspree" } | { ok: false; reason: SubmitFailure };

const TIMEOUT_MS = 15000;
const FORMSPREE_ENDPOINT = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/;

// Only the two variables this file needs (passing import.meta.env itself would inline every VITE_ value).
const ENV: Record<string, string | undefined> = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_FORMSPREE_ENDPOINT: import.meta.env.VITE_FORMSPREE_ENDPOINT,
};

export const formspreeEnabled = (env: Record<string, string | undefined> = ENV) => FORMSPREE_ENDPOINT.test(env.VITE_FORMSPREE_ENDPOINT ?? "");

const readJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const isObject = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object";

const failureOf = (status: number): SubmitFailure =>
  status === 400 || status === 422 ? "invalid" : status === 429 ? "busy" : "server";

type Posted = { response: Response; data: unknown } | { timeout: true } | { offline: boolean };

async function post(url: string, body: unknown, headers: Record<string, string>, fetcher: typeof fetch): Promise<Posted> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return { offline: true };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetcher(url, { method: "POST", headers, body: JSON.stringify(body), signal: controller.signal });
    return { response, data: await readJson(response) };
  } catch (error) {
    // Aborted after the timeout: we cannot know whether the request was stored.
    if (controller.signal.aborted) return { timeout: true };
    // fetch rejects before any answer: network down, DNS, CORS.
    void error;
    return { offline: !(typeof navigator !== "undefined" && navigator.onLine) };
  } finally {
    clearTimeout(timer);
  }
}

/** Formspree answers 200 { next, ok: true }; errors carry "errors" or "error" (see @formspree/core). */
export async function sendToFormspree(req: ContactRequest, env: Record<string, string | undefined>, fetcher: typeof fetch): Promise<SubmitResult> {
  const r = await post(
    env.VITE_FORMSPREE_ENDPOINT!,
    { name: req.name, email: req.email, subject: req.subject, message: req.message },
    { Accept: "application/json", "Content-Type": "application/json" },
    fetcher,
  );
  if ("timeout" in r) return { ok: false, reason: "unknown" };
  if (!("response" in r)) return { ok: false, reason: r.offline ? "offline" : "unknown" };
  const { response, data } = r;
  if (response.ok && isObject(data) && (typeof data.next === "string" || data.ok === true) && !("errors" in data) && !("error" in data)) return { ok: true };
  return { ok: false, reason: response.ok ? "server" : failureOf(response.status), status: response.status };
}

export async function sendToApi(req: ContactRequest, env: Record<string, string | undefined>, fetcher: typeof fetch): Promise<SubmitResult> {
  const r = await post(
    `${env.VITE_API_BASE_URL}/clientsMessages`,
    { name: req.name, email: req.email, subject: req.subject, textMessage: req.message },
    { "Content-Type": "application/json" },
    fetcher,
  );
  if ("timeout" in r) return { ok: false, reason: "unknown" };
  // A rejected fetch with the browser online is most often a refused/blocked request (nothing
  // stored); it is still reported as uncertain so the visitor is not pushed to send twice.
  if (!("response" in r)) return { ok: false, reason: r.offline ? "offline" : "unknown" };
  const { response, data } = r;
  // Application success, not only HTTP success: the backend answers { success: true, messageId }.
  if (response.ok && isObject(data) && data.success === true) {
    return { ok: true, id: typeof data.messageId === "string" ? data.messageId : undefined };
  }
  return { ok: false, reason: response.ok ? "server" : failureOf(response.status), status: response.status };
}

const settled = (r: PromiseSettledResult<SubmitResult>): SubmitResult => (r.status === "fulfilled" ? r.value : { ok: false, reason: "unknown" });

/** What went wrong, without personal data: only the two outcomes and their HTTP status. */
const diagnose = (name: string, r: SubmitResult) => (r.ok ? `${name}:ok` : `${name}:${r.reason}${r.status ? `:${r.status}` : ""}`);

export async function submitContact(
  req: ContactRequest,
  { env = ENV, fetcher = fetch }: { env?: Record<string, string | undefined>; fetcher?: typeof fetch } = {},
): Promise<DeliveryOutcome> {
  const both = formspreeEnabled(env);
  const [apiSettled, formspreeSettled] = await Promise.allSettled([
    sendToApi(req, env, fetcher),
    both ? sendToFormspree(req, env, fetcher) : Promise.resolve<SubmitResult>({ ok: true }),
  ]);
  const api = settled(apiSettled);
  const formspree = settled(formspreeSettled);
  if (!api.ok || !formspree.ok) console.warn(`[contact] ${diagnose("api", api)} ${diagnose("formspree", formspree)}`);
  if (api.ok && formspree.ok) return { ok: true, delivered: "full" };
  if (api.ok) return { ok: true, delivered: "api" };
  if (formspree.ok) return { ok: true, delivered: "formspree" };
  // Neither succeeded. One that may have arrived decides: the visitor must not be pushed to send twice.
  const reasons = [api.reason, !formspree.ok ? formspree.reason : api.reason];
  const reason = reasons.includes("unknown") ? "unknown" : reasons.includes("offline") ? "offline" : reasons.includes("invalid") ? "invalid" : api.reason;
  return { ok: false, reason };
}
