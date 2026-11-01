import { afterEach, describe, expect, it, vi } from "vitest";
import { formspreeEnabled, sendToApi, sendToFormspree, submitContact } from "../public/contactSubmit";

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
    const r = await sendToApi(REQ, API, fetcher);
    expect(r).toEqual({ ok: true, id: "id-1" });
    expect(fetcher).toHaveBeenCalledTimes(1);
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe("https://api.example.test/clientsMessages");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual({ name: REQ.name, email: REQ.email, subject: REQ.subject, textMessage: REQ.message });
  });

  it("treats HTTP 200 without application success as a failure", async () => {
    expect(await sendToApi(REQ, API, vi.fn().mockResolvedValue(json(200, { success: false, error: "x" })))).toEqual({ ok: false, reason: "server", status: 200 });
    expect(await sendToApi(REQ, API, vi.fn().mockResolvedValue(new Response("<html>", { status: 200 })))).toEqual({ ok: false, reason: "server", status: 200 });
  });

  it.each([
    [400, "invalid"],
    [422, "invalid"],
    [401, "server"],
    [403, "server"],
    [429, "busy"],
    [500, "server"],
  ])("maps HTTP %i to %s", async (status, reason) => {
    const r = await sendToApi(REQ, API, vi.fn().mockResolvedValue(json(status, { success: false, error: "Validation failed" })));
    expect(r).toEqual({ ok: false, reason, status });
  });

  it("reports offline without sending anything", async () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const fetcher = vi.fn();
    expect(await sendToApi(REQ, API, fetcher)).toEqual({ ok: false, reason: "offline" });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("reports a timeout as uncertain (the request may have arrived)", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn(
      (_url: string, init: RequestInit) =>
        new Promise<Response>((_, reject) => init.signal!.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")))),
    );
    const pending = sendToApi(REQ, API, fetcher as unknown as typeof fetch);
    await vi.advanceTimersByTimeAsync(15000);
    expect(await pending).toEqual({ ok: false, reason: "unknown" });
  });

  it("reports a rejected request while online as uncertain", async () => {
    const r = await sendToApi(REQ, API, vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    expect(r).toEqual({ ok: false, reason: "unknown" });
  });
});

const FORMSPREE = "https://formspree.io/f/abc123";
const BOTH = { ...API, VITE_FORMSPREE_ENDPOINT: FORMSPREE };
const API_OK = () => json(201, { success: true, messageId: "m1" });
const FS_OK = () => json(200, { next: "https://formspree.io/thanks", ok: true });

/** A fetch answering per destination. */
const route = (api: () => Response | Promise<Response>, formspree: () => Response | Promise<Response>) =>
  vi.fn((url: string) => (url === FORMSPREE ? formspree() : api())) as unknown as typeof fetch & ReturnType<typeof vi.fn>;

describe("Formspree adapter", () => {
  it("only accepts a real form endpoint", () => {
    expect(formspreeEnabled(API)).toBe(false);
    expect(formspreeEnabled({ ...API, VITE_FORMSPREE_ENDPOINT: "https://formspree.io/f/XXXX-placeholder" })).toBe(false);
    expect(formspreeEnabled({ ...API, VITE_FORMSPREE_ENDPOINT: "https://example.com/f/abc123" })).toBe(false);
    expect(formspreeEnabled(BOTH)).toBe(true);
  });

  it("posts the agreed contract and nothing else", async () => {
    const fetcher = vi.fn().mockResolvedValue(FS_OK());
    expect(await sendToFormspree(REQ, BOTH, fetcher)).toEqual({ ok: true });
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe(FORMSPREE);
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ Accept: "application/json", "Content-Type": "application/json" });
    expect(JSON.parse(init.body)).toEqual({ name: REQ.name, email: REQ.email, subject: REQ.subject, message: REQ.message });
  });

  it("HTTP and application errors are failures", async () => {
    for (const [status, reason] of [[400, "invalid"], [403, "server"], [422, "invalid"], [429, "busy"], [500, "server"]] as const) {
      expect(await sendToFormspree(REQ, BOTH, vi.fn().mockResolvedValue(json(status, { error: "x" })))).toEqual({ ok: false, reason, status });
    }
    expect(await sendToFormspree(REQ, BOTH, vi.fn().mockResolvedValue(json(200, { errors: [{ message: "x" }], ok: true })))).toEqual({ ok: false, reason: "server", status: 200 });
    expect(await sendToFormspree(REQ, BOTH, vi.fn().mockResolvedValue(json(200, {})))).toEqual({ ok: false, reason: "server", status: 200 });
    expect(await sendToFormspree(REQ, BOTH, vi.fn().mockResolvedValue(new Response("<html>", { status: 200 })))).toEqual({ ok: false, reason: "server", status: 200 });
  });
});

describe("both deliveries", () => {
  it("both succeed: each is called once with its own payload", async () => {
    const fetcher = route(API_OK, FS_OK);
    expect(await submitContact(REQ, { env: BOTH, fetcher })).toEqual({ ok: true, delivered: "full" });
    expect(fetcher).toHaveBeenCalledTimes(2);
    const api = fetcher.mock.calls.find((c: unknown[]) => c[0] !== FORMSPREE)!;
    expect(api[0]).toBe("https://api.example.test/clientsMessages");
    expect(JSON.parse((api[1] as RequestInit).body as string)).toEqual({ name: REQ.name, email: REQ.email, subject: REQ.subject, textMessage: REQ.message });
  });

  it("no endpoint: the API alone, as a normal confirmation", async () => {
    const fetcher = route(API_OK, FS_OK);
    expect(await submitContact(REQ, { env: API, fetcher })).toEqual({ ok: true, delivered: "full" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("partial success is a success that names only what succeeded, with no second attempt", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const apiOnly = route(API_OK, () => json(500, { error: "x" }));
    expect(await submitContact(REQ, { env: BOTH, fetcher: apiOnly })).toEqual({ ok: true, delivered: "api" });
    expect(apiOnly).toHaveBeenCalledTimes(2);
    const formspreeOnly = route(() => json(500, { success: false }), FS_OK);
    expect(await submitContact(REQ, { env: BOTH, fetcher: formspreeOnly })).toEqual({ ok: true, delivered: "formspree" });
    expect(formspreeOnly).toHaveBeenCalledTimes(2);
  });

  it("both fail: the reason comes back and the diagnostics hold no personal data", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetcher = route(() => json(500, { success: false }), () => json(422, { errors: [] }));
    expect(await submitContact(REQ, { env: BOTH, fetcher })).toEqual({ ok: false, reason: "invalid" });
    const logged = warn.mock.calls.flat().join(" ");
    expect(logged).toBe("[contact] api:server:500 formspree:invalid:422");
    for (const value of Object.values(REQ)) expect(logged).not.toContain(value);
  });

  it("a timeout is never proof of failure: uncertain when nothing succeeded, no retry", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const hang = (_: string, init: RequestInit) =>
      new Promise<Response>((_, reject) => init.signal!.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError"))));
    const fetcher = vi.fn((url: string, init: RequestInit) => (url === FORMSPREE ? hang(url, init) : Promise.resolve(json(500, { success: false })))) as unknown as typeof fetch & ReturnType<typeof vi.fn>;
    const pending = submitContact(REQ, { env: BOTH, fetcher });
    await vi.advanceTimersByTimeAsync(15001);
    expect(await pending).toEqual({ ok: false, reason: "unknown" });
    expect(fetcher).toHaveBeenCalledTimes(2);

    const apiHangs = vi.fn((url: string, init: RequestInit) => (url === FORMSPREE ? Promise.resolve(FS_OK()) : hang(url, init))) as unknown as typeof fetch;
    const second = submitContact(REQ, { env: BOTH, fetcher: apiHangs });
    await vi.advanceTimersByTimeAsync(15001);
    expect(await second).toEqual({ ok: true, delivered: "formspree" });
  });
});
