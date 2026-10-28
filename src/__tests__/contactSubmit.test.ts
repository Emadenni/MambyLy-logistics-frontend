import { afterEach, describe, expect, it, vi } from "vitest";
import { contactProvider, submitContact } from "../public/contactSubmit";

const API = { VITE_API_BASE_URL: "https://api.example.test" };
const REQ = { name: "Alex Exempel", email: "alex@example.com", subject: "Webbplats", message: "Tio tecken eller mer." };

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("submitContact – existing API", () => {
  it("posts the exact contract: message is mapped to textMessage", async () => {
    const fetcher = vi.fn().mockResolvedValue(json(201, { success: true, message: "Message successfully sent", messageId: "id-1" }));
    const r = await submitContact(REQ, { env: API, fetcher });
    expect(r).toEqual({ ok: true, id: "id-1" });
    expect(fetcher).toHaveBeenCalledTimes(1);
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe("https://api.example.test/clientsMessages");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual({ name: REQ.name, email: REQ.email, subject: REQ.subject, textMessage: REQ.message });
  });

  it("treats HTTP 200 without application success as a failure", async () => {
    expect(await submitContact(REQ, { env: API, fetcher: vi.fn().mockResolvedValue(json(200, { success: false, error: "x" })) })).toEqual({ ok: false, reason: "server", status: 200 });
    expect(await submitContact(REQ, { env: API, fetcher: vi.fn().mockResolvedValue(new Response("<html>", { status: 200 })) })).toEqual({ ok: false, reason: "server", status: 200 });
  });

  it.each([
    [400, "invalid"],
    [422, "invalid"],
    [401, "server"],
    [403, "server"],
    [429, "busy"],
    [500, "server"],
  ])("maps HTTP %i to %s", async (status, reason) => {
    const r = await submitContact(REQ, { env: API, fetcher: vi.fn().mockResolvedValue(json(status, { success: false, error: "Validation failed" })) });
    expect(r).toEqual({ ok: false, reason, status });
  });

  it("reports offline without sending anything", async () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const fetcher = vi.fn();
    expect(await submitContact(REQ, { env: API, fetcher })).toEqual({ ok: false, reason: "offline" });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("reports a timeout as uncertain (the request may have arrived)", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn(
      (_url: string, init: RequestInit) =>
        new Promise<Response>((_, reject) => init.signal!.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")))),
    );
    const pending = submitContact(REQ, { env: API, fetcher: fetcher as unknown as typeof fetch });
    await vi.advanceTimersByTimeAsync(15000);
    expect(await pending).toEqual({ ok: false, reason: "unknown" });
  });

  it("reports a rejected request while online as uncertain", async () => {
    const r = await submitContact(REQ, { env: API, fetcher: vi.fn().mockRejectedValue(new TypeError("Failed to fetch")) });
    expect(r).toEqual({ ok: false, reason: "unknown" });
  });
});

describe("provider selection", () => {
  it("uses the existing API unless Formspree is explicitly and validly configured", () => {
    expect(contactProvider(API)).toBe("api");
    expect(contactProvider({ ...API, VITE_CONTACT_PROVIDER: "formspree" })).toBe("api");
    expect(contactProvider({ ...API, VITE_CONTACT_PROVIDER: "formspree", VITE_FORMSPREE_ENDPOINT: "https://formspree.io/f/XXXX-placeholder" })).toBe("api");
    expect(contactProvider({ ...API, VITE_FORMSPREE_ENDPOINT: "https://formspree.io/f/abc123" })).toBe("api");
    expect(contactProvider({ ...API, VITE_CONTACT_PROVIDER: "formspree", VITE_FORMSPREE_ENDPOINT: "https://formspree.io/f/abc123" })).toBe("formspree");
  });

  it("Formspree: one request to Formspree only, its own contract, no fallback to the API", async () => {
    const env = { ...API, VITE_CONTACT_PROVIDER: "formspree", VITE_FORMSPREE_ENDPOINT: "https://formspree.io/f/abc123" };
    const fetcher = vi.fn().mockResolvedValue(json(500, { error: "x" }));
    expect(await submitContact(REQ, { env, fetcher })).toEqual({ ok: false, reason: "server", status: 500 });
    expect(fetcher).toHaveBeenCalledTimes(1);
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe("https://formspree.io/f/abc123");
    expect(init.headers.Accept).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual({ name: REQ.name, email: REQ.email, _subject: REQ.subject, message: REQ.message });

    const ok = vi.fn().mockResolvedValue(json(200, { next: "https://formspree.io/thanks", ok: true }));
    expect(await submitContact(REQ, { env, fetcher: ok })).toEqual({ ok: true });
    const bad = vi.fn().mockResolvedValue(json(200, { errors: [{ message: "x" }] }));
    expect(await submitContact(REQ, { env, fetcher: bad })).toEqual({ ok: false, reason: "server", status: 200 });
  });
});
