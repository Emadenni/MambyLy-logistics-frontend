# MambyLy Tools

A product line inside the MambyLy site: small pages that a physical tag (NFC tag or QR code) opens.
Shared engine "tag → smart page"; every tool is a page template. First tool: **MambyLy Stay**.

| Address | What |
|---|---|
| `/tools`, `/en/tools` | The shop window: one tile per tool (logo, one line); coming tools are shown switched off |
| `/tools/stay`, `/en/tools/stay` | MambyLy Stay landing page |
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
