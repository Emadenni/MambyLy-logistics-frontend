# MambyLy Tools

A product line inside the MambyLy site: small pages that a physical tag (NFC tag or QR code) opens.
Shared engine "tag → smart page"; every tool is a page template. First tool: **MambyLy Stay**.

| Address | What |
|---|---|
| `/tools`, `/en/tools` | The shop window: one tile per tool (logo, one line); coming tools are shown switched off |
| `/tools/stay`, `/en/tools/stay` | MambyLy Stay landing page |
| `/tools/reviews`, `/en/tools/reviews` | MambyLy Reviews landing page, with a phone to tap (demo of the customer page) |
| `/tools/guide`, `/en/tools/guide` | MambyLy Guide landing page (what, 3 steps, who, indicative prices, demo, contact) |
| `/tools/guide/demo/hembygdsgard` (+ `/<point>`) | Demo: "Exempelby hembygdsgård", a made-up heritage farm with 7 points |
| `/guide/<place>` (+ `/<point>`) | Visitor page of a real place: the address on the sign at each point |
| `/tools/stay/demo/stuga` | Demo: "Sjöstugan vid Roxen" (cottage by the lake) |
| `/tools/stay/demo/lagenhet` | Demo: "Stadsvåningen" (city flat) |
| `/stay/<house>?k=<key>` | Guest page of a real house (the NFC tag / QR code link) |

Entry points from the main site: the compass menu (MambyLy Tools) and the footer link.

## Code

- `src/public/tools/catalogue.ts` – the tools (name, one line, who it is for, active / coming soon).
- `src/public/tools/ToolsChrome.tsx`, `ToolsHome.tsx`, `styles/tools.scss` – the line's own look.
- `src/public/tools/stay/` – Stay:
  - `types.ts` – the record of one house (everything a future host panel edits).
  - `data.ts` – where house data lives and how the page loads it; the phone's language.
  - `answer.ts` – **the one function the chat answers through**: `answer(house, question, lang)`.
    Today: keywords (Swedish, English, German; accents and case ignored; shared synonyms) against
    the house's prepared answers. It is async: an AI answer from the same manual can replace its
    inside later without the page changing. Questions without an answer are kept on the guest's
    phone only (`recordUnanswered`), ready to be sent to a host panel later.
  - `Guest.tsx` (guest page and chat), `Drawing.tsx` (cottage / town house), `strings.ts` (sv/en/de),
    `StayLanding.tsx`, `pricing.ts` (**indicative prices: placeholders, change them there**),
    `domains.ts` (optional own domains).
- `styles/stay.scss` – the guest page (Familjen Grotesk, self-hosted from `@fontsource/familjen-grotesk`).
- Tests: `src/__tests__/stayAnswer.test.ts`.

No backend and no AI: the chat only uses the house's prepared answers.

**MambyLy Reviews** (`src/public/tools/reviews/ReviewsLanding.tsx`): a sign at the counter whose tag opens a
short thank-you and a button into the business's own Google review form. Today it is the landing page
only: no prices yet, no customer page of its own (the phone on the page is a demo with a made-up café).
Every customer is sent to the same form – never filter who is asked (against Google's rules). Its
wordmark is composed (`ToolMark`), with the script name in the tool's `accent` colour from the catalogue.

## What the tools share

`src/public/tools/shared/engine.ts` is the one engine under every tag page: the languages (sv/en/de),
`Texts` and `pick` (a text in a language, with fallback), `phoneLang` (the visitor's language from the
phone), `fetchJson` (a data file; only a JSON answer counts, since the host answers unknown paths with
the page itself) and the slug check. Stay and Guide both use it; a new kind of tag page starts there.

## MambyLy Guide

An audio guide for small museums, churches, heritage societies, villages and trails: a sign with an NFC
tag and a QR code at each point; the visitor taps and gets that point's page with text, picture and
audio in their language. No app, no audio guide to rent. Annual subscription per place (**placeholder
prices in `guide/pricing.ts`**), NFC signs included up to a number of points.

- `src/public/tools/guide/` – `types.ts` (the record of a place: **the one shape a future panel edits**),
  `data.ts` (loading and checking `public/guide-data/<slug>/place.json`), `GuidePages.tsx` (routes),
  `GuideView.tsx` (the place's start page and a point's page), `Listen.tsx` (the Listen button),
  `speech.ts`, `visited.ts`, `strings.ts`, `PointArt.tsx` (the demo's drawn scenes), `GuideLanding.tsx`,
  `pricing.ts`. Styles: `styles/guide.scss` (visitor page, Tools green #1d3a35) and `tools.scss` (landing).
- A place: name, locality, languages, welcome, hours, and `points` in walking order. A point: `id` (the
  last part of the address), `name`, `text` (per language), `photo` (`src` = a file/address, or `art` =
  one of the drawn scenes), `audio` (per language, an mp3).
- **Listen**: if the point has an `audio` file for the language it plays that; otherwise the phone reads
  the text with its own voice for the language (Web Speech API, free, in short pieces). With no voice for
  the language installed the button is switched off and says so. Pause on the phone's voice stops at the
  current piece and goes on from there.
- Remembered **only in the visitor's browser** (localStorage, nothing sent): the points seen and the language.
- No API, no AI, no backend. Real places' files are **not committed** (`.gitignore` keeps everything under
  `public/guide-data/` out of git except the demo): the customer's texts and photos are theirs. Before the
  first real place goes live, decide where its files are hosted (like Stay's, see below).
- New place: `node scripts/guide-new-place.mjs <slug>` copies the demo and prints the address of every
  point for its NFC tag and QR code. Photos and recordings go in the same folder (`/guide-data/<slug>/…`).
- The visitor pages are `noindex`. `public/tools/guide-skylt.jpg` on the landing is a **placeholder** (4:3).

## Adding a real house

```
node scripts/stay-new-house.mjs <slug> [stuga|city]
```

It creates `public/stay-data/<slug>/<secret key>.json` (a copy of the demo to fill in) and prints the
link to write on the NFC tag and encode in the QR code: `https://www.mambylysolutions.se/stay/<slug>?k=<key>`.

Why the key: the key box code and the Wi-Fi password are in the house's file. The file is not part
of the site's code and its name is the secret key, so only someone with the link from the sign can
open it. Use a new key (new file name) if a link has to be withdrawn.

**The GitHub repository is public.** Real house files must never be committed to it: `.gitignore`
keeps everything under `public/stay-data/` out of git except the two demos. Before the first real
house goes live, choose how its file reaches the hosting: make the repository private (then remove
that `.gitignore` rule), or keep the house files in separate storage (for example an S3 bucket
served under `/stay-data/`).

House file fields: `name`, `place`, `languages` (`sv`/`en`/`de`), `template` (`stuga`/`city`), `host`
(name, phone for the SMS button, welcome text), `arrival` (key code and where, Wi-Fi, times),
`sections` (the accordion: icon, title, text), `answers` (chat: keywords in any language, the reply,
`suggest` + `question` to show it as a suggested question). Texts can use `{keyCode}`, `{wifiName}`,
`{wifiPassword}`, `{checkIn}`, `{checkOut}`, `{hostName}`, `{hostPhone}`.

## Own domain (optional)

Add `"<domain>": "<slug>"` to `src/public/tools/stay/domains.ts`, point the domain (CNAME) to the
site and add it in the hosting. The sign's link becomes `https://<domain>/?k=<key>`.

## Logos and pictures

- `public/brand/mambyly-tools-verde.svg` / `mambyly-tools-bianco.svg` – the line's logo, green for
  light backgrounds and white for dark ones (`TOOLS_LOGO` in the catalogue).
- `public/brand/mambyly-stay.png` – Stay's logo (light, transparent: for dark backgrounds).
- A tool's tile on `/tools` shows the `logo` given in the catalogue. A tool without one gets a
  provisional wordmark composed in the same style (`ToolMark.tsx`); add `logo` when the drawn one exists.
- `public/tools/stay-stand.jpg` – the sign in a house (4:3, 1200 × 900): on the Stay page and in the
  Tools banner on Utforska.
