import React, { useCallback, useEffect, useRef, useState } from "react";
import { LuPause, LuPlay, LuSquare, LuVolume2 } from "react-icons/lu";
import { splitText, SPEECH_TAG, voiceFor } from "./speech";
import { GUIDE_UI } from "./strings";
import type { GuideLang } from "./types";

type Mode = "idle" | "playing" | "paused";

const speechSupported = () => typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

/**
 * The Listen button of a point. With an uploaded recording (mp3) for this language it plays that;
 * otherwise the phone reads the text aloud with its own voice for the language (Web Speech API).
 * Pause on the phone's voice stops at the current piece and goes on from there (the browsers' own
 * pause is not dependable on phones). Leaving the point, or changing language, silences it.
 */
const Listen: React.FC<{ text: string; lang: GuideLang; audioSrc?: string }> = ({ text, lang, audioSrc }) => {
  const u = GUIDE_UI[lang];
  const [mode, setMode] = useState<Mode>("idle");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[] | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const piece = useRef(0);
  const run = useRef(0); // a new run (or a stop) makes the earlier speech's callbacks do nothing

  // the phone's voices arrive a moment after the page on some browsers
  useEffect(() => {
    if (audioSrc || !speechSupported()) return;
    const synth = window.speechSynthesis;
    const read = () => setVoices(synth.getVoices());
    read();
    synth.addEventListener?.("voiceschanged", read);
    return () => synth.removeEventListener?.("voiceschanged", read);
  }, [audioSrc]);

  const silence = useCallback(() => {
    run.current += 1;
    piece.current = 0;
    audio.current?.pause();
    if (speechSupported()) window.speechSynthesis.cancel();
    setMode("idle");
  }, []);

  // another point or language: quiet
  useEffect(() => {
    silence();
    return () => {
      run.current += 1;
      if (speechSupported()) window.speechSynthesis.cancel();
    };
  }, [text, lang, audioSrc, silence]);

  const speak = useCallback(() => {
    const synth = window.speechSynthesis;
    const pieces = splitText(text);
    const voice = voiceFor(synth.getVoices(), lang);
    const mine = ++run.current;
    synth.cancel();
    const next = () => {
      if (run.current !== mine) return;
      if (piece.current >= pieces.length) {
        piece.current = 0;
        setMode("idle");
        return;
      }
      const ut = new SpeechSynthesisUtterance(pieces[piece.current]);
      ut.lang = voice?.lang ?? SPEECH_TAG[lang];
      if (voice) ut.voice = voice;
      ut.rate = 0.95;
      ut.onend = () => {
        if (run.current !== mine) return;
        piece.current += 1;
        next();
      };
      ut.onerror = () => {
        if (run.current !== mine) return;
        setMode(piece.current > 0 ? "paused" : "idle");
      };
      synth.speak(ut);
    };
    setMode("playing");
    next();
  }, [text, lang]);

  const play = () => {
    if (audioSrc) {
      const el = audio.current;
      if (!el) return;
      void el.play().catch(() => setMode("idle"));
      setMode("playing");
      return;
    }
    speak();
  };

  const pause = () => {
    if (audioSrc) {
      audio.current?.pause();
      setMode("paused");
      return;
    }
    // the phone's voice: stop here, and resume from this piece
    run.current += 1;
    window.speechSynthesis.cancel();
    setMode("paused");
  };

  if (!audioSrc && !speechSupported()) return <p className="gd-note">{u.noSpeech}</p>;
  // voices known and none for this language: say so (an empty list may only be late)
  const noVoice = !audioSrc && !!voices && voices.length > 0 && !voiceFor(voices, lang);

  return (
    <div className="gd-listen">
      {audioSrc && (
        <audio
          ref={audio}
          src={audioSrc}
          preload="none"
          onEnded={() => setMode("idle")}
          onPause={() => setMode((m) => (m === "playing" ? "paused" : m))}
        />
      )}
      <div className="gd-listen__row">
        {mode === "playing" ? (
          <button type="button" className="gd-btn gd-btn--solid" onClick={pause}>
            <LuPause aria-hidden /> {u.pause}
          </button>
        ) : (
          <button type="button" className="gd-btn gd-btn--solid" onClick={play} disabled={noVoice}>
            {mode === "paused" ? <LuPlay aria-hidden /> : <LuVolume2 aria-hidden />} {mode === "paused" ? u.resume : u.listen}
          </button>
        )}
        {mode !== "idle" && (
          <button type="button" className="gd-btn gd-btn--round" onClick={silence} aria-label={u.stop}>
            <LuSquare aria-hidden />
          </button>
        )}
        {audioSrc && <span className="gd-listen__tag">{u.recorded}</span>}
      </div>
      {noVoice && <p className="gd-note">{u.noVoice}</p>}
    </div>
  );
};

export default Listen;
