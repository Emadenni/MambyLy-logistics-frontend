import { useEffect, useRef, useState } from "react";

/**
 * Copy text to the clipboard and report what really happened: "copied" only after the browser
 * confirmed it, "failed" otherwise (the text stays visible and selectable on screen).
 */
export const useCopy = () => {
  const [state, setState] = useState<{ key: string; result: "copied" | "failed" } | null>(null);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async (text: string, key = text) => {
    window.clearTimeout(timer.current);
    try {
      if (!navigator.clipboard) throw new Error("no clipboard");
      await navigator.clipboard.writeText(text);
      setState({ key, result: "copied" });
    } catch {
      setState({ key, result: "failed" });
    }
    timer.current = window.setTimeout(() => setState(null), 4000);
  };

  return { copy, resultFor: (key: string) => (state?.key === key ? state.result : null) };
};
