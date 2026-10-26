import type { CardConfig } from "./types";

/**
 * What a contact request is about. Sent to the existing contact form as navigation state
 * (location.state → PublicContact → ContactForm.subjectFromCard); the form, its endpoint and its
 * payload are unchanged: the choice only pre-fills the existing, editable "subject" field.
 */
export type ServiceKey = "card" | "both" | "site";

export const SERVICE_SUBJECTS: Record<ServiceKey, string> = {
  card: "Digitalt visitkort",
  both: "Digitalt visitkort + webbplats",
  site: "Webbplats",
};

export type ContactState = { service?: ServiceKey; example?: string; subject?: string };

export const exampleLabel = (card: CardConfig) => `${card.company || card.name} (${card.example?.sector ?? "exempel"})`;

export const subjectFor = (service: ServiceKey, example?: CardConfig) =>
  example && service !== "site" ? `${SERVICE_SUBJECTS[service]} – som exemplet ${exampleLabel(example)}` : SERVICE_SUBJECTS[service];
