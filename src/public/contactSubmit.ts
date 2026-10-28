/**
 * One way out for every public MambyLy contact request (wizard, card and generic requests).
 *
 * Provider "api" (default and the only active one): the existing backend,
 * POST {VITE_API_BASE_URL}/clientsMessages with { name, email, subject, textMessage } – the same
 * endpoint and payload as src/hooks/useSubmitMessage.ts. The backend validates with Joi (name 2–100,
 * email, subject 3–255, textMessage 10–2000), stores the request in DynamoDB and answers
 * 201 { success: true, messageId }. It does NOT send any e-mail notification: a positive answer
 * means "request stored", which is what the success screen says.
 *
 * Provider "formspree" (prepared, inactive): used only when VITE_CONTACT_PROVIDER=formspree AND
 * VITE_FORMSPREE_ENDPOINT is a real https://formspree.io/f/<id> form endpoint. Exactly one provider
 * is used per request; there is no fallback from one to the other.
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

export type ContactProvider = "api" | "formspree";

const TIMEOUT_MS = 15000;
const FORMSPREE_ENDPOINT = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/;

export function contactProvider(env: Record<string, string | undefined> = import.meta.env): ContactProvider {
  return env.VITE_CONTACT_PROVIDER === "formspree" && FORMSPREE_ENDPOINT.test(env.VITE_FORMSPREE_ENDPOINT ?? "") ? "formspree" : "api";
}

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

export async function submitContact(
  req: ContactRequest,
  { env = import.meta.env, fetcher = fetch }: { env?: Record<string, string | undefined>; fetcher?: typeof fetch } = {},
): Promise<SubmitResult> {
  const provider = contactProvider(env);

  if (provider === "formspree") {
    const r = await post(
      env.VITE_FORMSPREE_ENDPOINT!,
      { name: req.name, email: req.email, _subject: req.subject, message: req.message },
      { Accept: "application/json", "Content-Type": "application/json" },
      fetcher,
    );
    if ("timeout" in r) return { ok: false, reason: "unknown" };
    if (!("response" in r)) return { ok: false, reason: r.offline ? "offline" : "unknown" };
    const { response, data } = r;
    // Formspree: success carries "next"; errors carry "errors" or "error".
    if (response.ok && isObject(data) && typeof data.next === "string" && !("errors" in data) && !("error" in data)) return { ok: true };
    return { ok: false, reason: response.ok ? "server" : failureOf(response.status), status: response.status };
  }

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
