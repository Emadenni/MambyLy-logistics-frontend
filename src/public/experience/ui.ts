import { create } from "zustand";

/** Small in-memory UI state shared between screens (nothing here is persisted). */
type UiState = {
  /** The home cover is on screen: the cookie banner waits until it is lifted. */
  coverShown: boolean;
  setCoverShown: (shown: boolean) => void;
  /** Set when the visitor asks to change the cookie choice (footer, privacy page). */
  consentRequested: number;
  requestConsent: () => void;
  /** Last item seen in each gallery (websites, cards), so coming back shows the same one. */
  gallery: Record<string, number>;
  setGallery: (id: string, index: number) => void;
};

export const useUi = create<UiState>((set) => ({
  coverShown: false,
  setCoverShown: (coverShown) => set({ coverShown }),
  consentRequested: 0,
  requestConsent: () => set((s) => ({ consentRequested: s.consentRequested + 1 })),
  gallery: {},
  setGallery: (id, index) => set((s) => (s.gallery[id] === index ? s : { gallery: { ...s.gallery, [id]: index } })),
}));
