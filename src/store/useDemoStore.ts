import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DemoStore {
  contentSentViaDemo: boolean;
  setContentSentViaDemo: (value: boolean) => void;
  resetDemo: () => void;
}

export const useDemoStore = create<DemoStore>()(
  persist(
    (set) => ({
      contentSentViaDemo: false,
      setContentSentViaDemo: (value) => set({ contentSentViaDemo: value }),
      resetDemo: () => set({ contentSentViaDemo: false }),
    }),
    { name: "demoStore" }
  )
);

