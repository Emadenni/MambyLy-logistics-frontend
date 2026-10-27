import { create } from "zustand";
import type { ServiceKey } from "../digital-card/service";

/**
 * Answers of the contact wizard. In memory only (never localStorage, URL or analytics): they
 * survive a change of language or a visit to another screen in the same tab, and are cleared
 * after a request has really been accepted by the API.
 */
export type WizardAnswers = {
  step: 0 | 1 | 2;
  name: string;
  service?: ServiceKey;
  existing?: "yes" | "no";
  example?: string;
  message: string;
  email: string;
  consent: boolean;
};

const empty: WizardAnswers = { step: 0, name: "", message: "", email: "", consent: false };

type WizardStore = WizardAnswers & {
  set: (patch: Partial<WizardAnswers>) => void;
  reset: () => void;
};

export const useWizard = create<WizardStore>((set) => ({
  ...empty,
  set: (patch) => set(patch),
  reset: () => set({ ...empty }),
}));

export const NAME_MIN = 2;
export const NAME_MAX = 100;
export const MESSAGE_MIN = 10;
/** The existing limit is 2000 characters; a few lines of context are added to the message. */
export const MESSAGE_MAX = 1900;
// Same pattern as src/utils/formValidation.ts.
export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validName = (a: WizardAnswers) => a.name.trim().length >= NAME_MIN && a.name.trim().length <= NAME_MAX;
export const validMessage = (a: WizardAnswers) => a.message.trim().length >= MESSAGE_MIN && a.message.trim().length <= MESSAGE_MAX;
export const validEmail = (a: WizardAnswers) => EMAIL_PATTERN.test(a.email.trim());

export const stepValid = (a: WizardAnswers, step: number) =>
  step === 0 ? validName(a) : step === 1 ? !!a.service && validMessage(a) : validEmail(a) && a.consent;
