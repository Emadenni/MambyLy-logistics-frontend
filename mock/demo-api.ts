import type { IncomingMessage, ServerResponse } from "http";

/**
 * Local mock API for `npm run demo` (vite --mode demo), served by vite-plugin-mock, which is
 * already configured in vite.config.ts and only runs with the dev server (never in builds).
 * Returns no routes in any other mode.
 *
 * Mirrors the endpoints used by the public forms (hooks/useSubmitMessage.ts):
 *   POST {VITE_API_BASE_URL}/clientsMessages   contact form
 *   POST {VITE_API_BASE_URL}/jobMessages       job application (+ uploadCvBase64)
 * Nothing is stored or forwarded. Include "#fel" in the message to simulate a server error.
 * GET /__demo-api/_log lists what the demo received (field names and sizes only).
 */

type LoggedRequest = {
  at: string;
  method: string;
  path: string;
  contentType: string | undefined;
  authorization: boolean;
  fields: string[];
  cvBase64Length?: number;
  simulatedError: boolean;
};

const received: LoggedRequest[] = [];

const readJson = (req: IncomingMessage): Promise<Record<string, unknown>> =>
  new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });

const sendJson = (res: ServerResponse, status: number, payload: unknown) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const messageEndpoint = (name: "clientsMessages" | "jobMessages") => ({
  url: `/__demo-api/${name}`,
  method: "post" as const,
  timeout: 1200,
  rawResponse: async (req: IncomingMessage, res: ServerResponse) => {
    const body = await readJson(req);
    const text = typeof body.textMessage === "string" ? body.textMessage : "";
    const simulatedError = text.includes("#fel");

    received.push({
      at: new Date().toISOString(),
      method: req.method ?? "",
      path: `/${name}`,
      contentType: req.headers["content-type"],
      authorization: Boolean(req.headers.authorization),
      fields: Object.keys(body),
      cvBase64Length: typeof body.uploadCvBase64 === "string" ? body.uploadCvBase64.length : undefined,
      simulatedError,
    });

    if (simulatedError) {
      sendJson(res, 500, { success: false, message: "Demo: simulerat serverfel" });
      return;
    }
    sendJson(res, 200, { success: true, message: "Demo: inget har skickats" });
  },
});

export default ({ mode }: { mode: string }) =>
  mode === "demo"
    ? [
        messageEndpoint("clientsMessages"),
        messageEndpoint("jobMessages"),
        {
          url: "/__demo-api/jobPositions",
          method: "get" as const,
          rawResponse: (_req: IncomingMessage, res: ServerResponse) => sendJson(res, 200, { success: true }),
        },
        {
          url: "/__demo-api/_log",
          method: "get" as const,
          rawResponse: (_req: IncomingMessage, res: ServerResponse) => sendJson(res, 200, received),
        },
      ]
    : [];
