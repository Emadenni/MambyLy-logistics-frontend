import type { CardConfig } from "./types";

/**
 * What a contact request is about. Sent to the contact wizard as navigation state
 * (location.state → Contact); the wizard posts it as the existing "subject" field of the existing
 * endpoint (useSubmitMessage → /clientsMessages). Subjects stay in Swedish whatever the language of
 * the page, so requests read the same way in the admin.
 */
export type ServiceKey = "card" | "both" | "site" | "tools" | "other";

export const SERVICE_SUBJECTS: Record<ServiceKey, string> = {
  card: "Digitalt visitkort",
  both: "Digitalt visitkort + webbplats",
  site: "Webbplats",
  tools: "MambyLy Tools",
  other: "Övrigt",
};

/** `tool`: the id of a MambyLy Tools tool (tools/catalogue.ts) when the request is about one. */
export type ContactState = { service?: ServiceKey; example?: string; subject?: string; tool?: string };

export const exampleLabel = (card: CardConfig) => card.example?.sector ?? card.company ?? card.name;

export const subjectFor = (service: ServiceKey, example?: CardConfig, toolName?: string) =>
  service === "tools" && toolName
    ? `${SERVICE_SUBJECTS.tools} – ${toolName}`
    : example && (service === "card" || service === "both")
      ? `${SERVICE_SUBJECTS[service]} – som exemplet ${exampleLabel(example)}`
      : SERVICE_SUBJECTS[service];
