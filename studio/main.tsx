import React from "react";
import { createRoot } from "react-dom/client";
import Studio from "./engine/Studio";
import { formats } from "./formats";
import "../src/public/styles/public.scss";
import "./studio.scss";

/**
 * ?format=<id>      which video (default: the first one)
 * &variant=<id>     export variant, e.g. reel / story
 * &capture=1        no autoplay: capture.mjs steps the time
 * &t=<ms>           show one frame and stop
 */
const params = new URLSearchParams(window.location.search);
const format = formats[params.get("format") ?? ""] ?? Object.values(formats)[0];
const variant = params.get("variant") ?? Object.keys(format.variants ?? {})[0] ?? "default";
const at = params.has("t") ? Number(params.get("t")) : undefined;
const autoplay = !params.has("capture") && at === undefined;

document.documentElement.classList.toggle("st-capture", !autoplay);
createRoot(document.getElementById("studio")!).render(
  <React.StrictMode>
    <Studio format={format} variant={variant} autoplay={autoplay} at={at} />
  </React.StrictMode>,
);
