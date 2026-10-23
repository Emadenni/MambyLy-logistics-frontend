# Restyle del sito pubblico – "Mindre krångel. Mer företag."

Branch: `restyle/mambyly-public` (creato da `origin/dev`, che corrisponde alla build oggi online).

## Dove sta il codice

- `src/public/` – nuove pagine pubbliche (Home, Tjänster, Kontakta oss, Om oss, Jobba med oss, 404),
  header/footer/menu mobile, scena animata della hero, dialog, stili.
- `src/App.tsx` – stesse rotte, cambiano solo i componenti importati. Le vecchie pagine restano nel
  repository e sono ancora importate solo per i loro fogli di stile, così admin, login e Sido Butik
  ricevono esattamente lo stesso CSS di prima (verificato: il CSS precedente è un prefisso identico
  del nuovo bundle; screenshot di /login, /admin e Sido Butik identici al pixel).
- Tutti i nuovi stili sono confinati in `.mambyly-public`, `.mp-dialog` o `body:has(.mambyly-public)`.
- Hook, API, store, form (`components/ContactForm`), admin, login, `vite.config.ts` e CI: invariati.

## Sido Butik (nascosto, non eliminato)

Flag: `src/public/config.ts` → `publicSiteConfig.showSidoButik`.

- `false` (attuale): nasconde la voce "Sido Butik" nell'header (desktop e menu mobile) e il blocco
  promozionale della home (banner + scelta "Startklar och budgetvänlig" con il link a `/sidoButik/mallar`).
- `true`: ripristina tutti questi punti di ingresso.

Le rotte `/sidoButik`, `/sidoButik/mallar`, `/sidoButik/mallar/:templateId`, i componenti, i dati, le
immagini e il carrello non dipendono dal flag e restano raggiungibili da URL diretto.

## Team pubblico

`src/public/content/team.ts` presenta solo Emanuele De Negri e Marija Markova (dati e foto presi da
`components/data/teamMembers.tsx`, che resta invariato ma non è più incluso nella build).

## Demo locale sicura

```
npm run demo        # = vite --mode demo, http://localhost:5173/
```

`.env.demo` punta `VITE_API_BASE_URL` a `/__demo-api`, servito da `mock/demo-api.ts` tramite
`vite-plugin-mock` (già configurato, attivo solo con il dev server). Stessi endpoint, metodi, header e
payload degli hook; nulla viene inoltrato o salvato. Analytics ed EmailJS disattivati.
Scrivere `#fel` nel messaggio simula un errore 500. `GET /__demo-api/_log` mostra cosa è stato ricevuto
(solo nomi dei campi e dimensioni). `vite build` non include nulla di tutto questo.

## Caricamento iniziale, icone e preload (`index.html`)

Uno script inline sceglie solo loader, preload e icone in base alla rotta di ingresso:
`/admin…`, `/login…`, `/sidoButik…` ricevono esattamente il loader nero, i 19 preload e le icone di prima
(conservati in `<template id="boot-head-legacy">` / `boot-loader-legacy`); tutte le altre rotte ricevono il
loader chiaro con il nuovo logo inline, le icone `public/brand/*` e nessun preload. Nessuna durata minima:
`src/main.tsx` lo rimuove come prima al `DOMContentLoaded`. Autenticazione e router non sono toccati.
Nota: navigando *dentro* la SPA dal sito pubblico all'admin, la favicon resta quella della rotta d'ingresso.

## Telefono e WhatsApp

`src/public/contact.ts` (072 211 64 22 · +46 72 211 64 22 · tel:+46722116422 · https://wa.me/46722116422).
Usato da pulsante WhatsApp, SocialBox, footer, Kontakta oss, Om oss. JSON-LD in `index.html` aggiornato.
Le e-mail non sono state cambiate (discordanza ancora da confermare dal proprietario).

## Digitala visitkort

- Pagina commerciale: `/digital-card` · biglietto: `/card/<slug>` · demo: `/card/exempelbageriet` (fittizia).
- Codice: `src/public/digital-card/` (componente 3D, condivisione, vCard 3.0, QR locale, validazione).
- La CTA "Begär offert" apre `/kontaktaOss` con `state.subject = "Digitalt visitkort"` (meccanismo già
  esistente del form, campo visibile e modificabile). Nessun nuovo form, endpoint o upload.

### Aggiungere un cliente

1. Crea `src/public/digital-card/cards/<slug>/` (slug: minuscole, cifre e trattini, es. `salong-lind`).
2. Aggiungi `card.json` (dati pubblici, niente segreti) ed eventuale `logo.svg`/`photo.webp`:

```json
{
  "slug": "salong-lind",
  "lang": "sv",
  "name": "Sara Lind",
  "role": "Frisör",
  "company": "Salong Lind",
  "logo": "logo.svg",
  "theme": { "front": "#ffffff", "frontInk": "#1d1d1f", "accent": "#7a3e65",
             "back": "#1d1d1f", "backInk": "#ffffff", "backAccent": "#e7b7d6", "style": "solid" },
  "phone": "<numero in formato E.164, es. +467…>",
  "email": "sara@example.com",
  "website": "https://example.com",
  "socials": [{ "type": "instagram", "url": "<https://www.instagram.com/account-del-cliente>" }],
  "details": [{ "label": "Öppet", "value": "Mån–fre 9–18" }],
  "meta": { "title": "Sara Lind – Salong Lind", "description": "Digitalt visitkort för Salong Lind." }
}
```

3. `node scripts/public-brand-assets.mjs` genera `public/cards/<slug>/og.png` (anteprima social).
4. `npm run build`: il plugin `build/static-route-meta.ts` scrive `dist/card/<slug>/index.html` con title,
   description, canonical e tag Open Graph/Twitter già nel HTML (per i crawler che non eseguono JS).

Regole: campi assenti o non validi → elemento non mostrato; solo `https:` per sito e social (e solo i domini
del social indicato); telefono in formato E.164; slug sconosciuto → pagina "Visitkortet hittades inte",
mai un altro biglietto. `"demo": true` rende i contatti non azionabili (solo avviso) e toglie il telefono
dalla vCard.

### Condivisione e limiti dei browser

`navigator.share` viene chiamato direttamente nel click o nel `pointerup` dello swipe; annullamento =
messaggio neutro, nessuna copia automatica; senza Web Share → "Kopiera länk"; senza Clipboard API →
link selezionabile. Su HTTP da IP locale (es. telefono → `http://192.168.x.x:5173`) Web Share e Clipboard
non sono disponibili (richiedono HTTPS): restano i fallback. URL condivisi, vCard e QR usano sempre
`window.location.origin`.
