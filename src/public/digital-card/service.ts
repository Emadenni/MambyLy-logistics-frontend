import type { CardConfig } from "./types";

/**
 * What a contact request is about. Sent to the contact wizard as navigation state
 * (location.state → Contact); the wizard posts it as the existing "subject" field of the existing
 * endpoint (useSubmitMessage → /clientsMessages). Subjects stay in Swedish whatever the language of
 * the page, so requests read the same way in the admin.
 */
export type ServiceKey = "card" | "both" | "site" | "other";

export const SERVICE_SUBJECTS: Record<ServiceKey, string> = {
  card: "Digitalt visitkort",
  both: "Digitalt visitkort + webbplats",
  site: "Webbplats",
  other: "Övrigt",
};

export type ContactState = { service?: ServiceKey; example?: string; subject?: string };

export const exampleLabel = (card: CardConfig) => `${card.company || card.name} (${card.example?.sector ?? "exempel"})`;

export const subjectFor = (service: ServiceKey, example?: CardConfig) =>
  example && (service === "card" || service === "both") ? `${SERVICE_SUBJECTS[service]} – som exemplet ${exampleLabel(example)}` : SERVICE_SUBJECTS[service];
