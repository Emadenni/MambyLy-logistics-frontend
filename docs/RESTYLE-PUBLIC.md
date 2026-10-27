# Restyle del sito pubblico – "Mindre krångel. Mer företag."

Branch: `restyle/mambyly-public` (creato da `origin/dev`, che corrisponde alla build oggi online).

## Dove sta il codice

- `src/public/experience/` – il sito pubblico "una schermata alla volta" (fase 5, vedi sotto): rotte e
  lingue (`routes.ts`, `i18n.tsx`, `copy.ts`), palcoscenico con le transizioni (`Stage.tsx`), geografia
  delle schermate (`nav.tsx`), barra, footer compatto e testa SEO (`Screen.tsx`), switch SV/EN, banner cookie,
  schermate in `screens/`.
- `src/public/digital-card/` – motore dei biglietti (invariato nella sostanza; testi tradotti in `card.json`).
- `src/public/pages/PublicCard.tsx` – `/card`, `/en/card`, `/card/<slug>`.
- `src/App.tsx` – le vecchie pagine restano nel repository e sono ancora importate solo per i loro fogli di
  stile, così admin, login e Sido Butik ricevono lo stesso CSS di prima.
- Tutti i nuovi stili sono confinati in `.mambyly-public` (`.mp-x`, `.mp-cardpage`), `.mp-dialog` o
  `body:has(...)`; fuori resta solo `@font-face` di MP Poppins e MP Newsreader.
- Hook, API, store, admin, login, `vite.config.ts` e CI: invariati.

## Sido Butik (nascosto, non eliminato)

Flag: `src/public/config.ts` → `publicSiteConfig.showSidoButik` (`false`: nessun ingresso dal sito pubblico;
`true`: link "Sido Butik" nel footer compatto). Le rotte `/sidoButik…` funzionano comunque da URL diretto.

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

- Biglietto di un cliente: `/card/<slug>` · biglietto MambyLy: `/card` · esempi: `/exempel`, `/exempel/<slug>`.
- Codice: `src/public/digital-card/` (un solo motore 3D configurabile, condivisione, vCard 3.0, QR locale, validazione).
- Le CTA aprono `/kontaktaOss` con `state = { service, example? }` (`service.ts`): la pagina pre-compila il campo
  "subject" già esistente del form (visibile e modificabile). Stesso form, endpoint e payload; nessun upload.

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
             "back": "#1d1d1f", "backInk": "#ffffff", "backAccent": "#e7b7d6", "style": "solid",
             "layout": "classic", "font": "sans" },
  "phone": "<numero in formato E.164, es. +467…>",
  "email": "sara@example.com",
  "website": "https://example.com",
  "socials": [{ "type": "instagram", "url": "<https://www.instagram.com/account-del-cliente>" }],
  "details": [{ "label": "Öppet", "value": "Mån–fre 9–18" }],
  "meta": { "title": "Sara Lind – Salong Lind", "description": "Digitalt visitkort för Salong Lind." }
}
```

3. `node scripts/public-brand-assets.mjs` genera `public/cards/<slug>/og.png` (anteprima social semplificata;
   le anteprime esistenti non vengono sovrascritte, `FORCE=1` per rigenerarle).
4. `npm run build`: il plugin `build/static-route-meta.ts` scrive `dist/card/<slug>/index.html` con title,
   description, canonical e tag Open Graph/Twitter già nel HTML (per i crawler che non eseguono JS) e
   `dist/card/<slug>.vcf`, la vCard statica aperta da "Spara kontakt".

`layout`: `classic` · `craft` (legno, monogramma a timbro) · `split` (fascia colorata col marchio) · `frame`
(scuro, angoli da mirino, nome centrato) · `bold` (logotipo grande, forme). `font`: `sans` (Poppins) o `serif`
(serif di sistema, nessun font scaricato). Gli esempi hanno `"demo": true` e `"example": { "sector", "summary", "order" }`.

Regole: campi assenti o non validi → elemento non mostrato; solo `https:` per sito e social (e solo i domini
del social indicato); telefono in formato E.164; slug sconosciuto → pagina "Visitkortet hittades inte",
mai un altro biglietto. `"demo": true` rende i contatti non azionabili (solo avviso) e toglie il telefono
dalla vCard.

### Condivisione e limiti dei browser

`navigator.share` viene chiamato direttamente nel click; annullamento =
messaggio neutro, nessuna copia automatica; senza Web Share → "Kopiera länk"; senza Clipboard API →
link selezionabile. Su HTTP da IP locale (es. telefono → `http://192.168.x.x:5173`) Web Share e Clipboard
non sono disponibili (richiedono HTTPS): restano i fallback. URL condivisi, vCard e QR usano sempre
`window.location.origin`.

### Biglietto aziendale MambyLy (`/card`)

`cards/mambyly-solutions/card.json` (`"kind": "organization"`, logo orizzontale `logo.svg`, `mark.svg` sul retro).
È pubblicato su `/card` (`COMPANY_CARD_SLUG` in `registry.ts`; `/card/mambyly-solutions` reindirizza a `/card`).
Contatti: telefono da `src/public/contact.ts`, e-mail `info@mambylysolutions.se` (il dominio con MX attivi;
`mambyly.se` non risolve), social come nel `SocialBox` del sito. Link discreto "Vårt visitkort" nel footer.

Sotto il biglietto: "Spara kontakt" (icona + testo), poi pulsanti solo icona con etichetta accessibile e tooltip
(Dela kortet / Kopiera länken secondo la disponibilità di Web Share, Visa baksidan / Visa framsidan, Visa QR-kod)
e il menu espandibile "Mer från MambyLy" (chiuso all'inizio, `aria-expanded`, Escape lo chiude): Webbplatser,
Digitala visitkort, Exempel, Om oss, Kontakt, dalla lista condivisa `destinations` in `experience/nav.tsx`, nella
lingua dell'interfaccia. In alto a destra lo switch SV/EN.

Accenno iniziale: breve inclinazione (≈1,25 s) su un wrapper `.dc__tilt` separato dalle trasformazioni di
trascinamento e rotazione; una volta per scheda (`sessionStorage`), si interrompe al primo tocco/tasto/focus,
disattivato con `prefers-reduced-motion`. Il biglietto usa `touch-action: pan-y`: il trascinamento orizzontale
gira il biglietto, quello verticale fa scorrere la pagina (lo "swipe in su per condividere" è stato tolto).

### Salva contatto (vCard)

- Produzione: link a `/card/<slug>.vcf` (file statico generato in build, stessi dati del generatore in pagina).
  Su iPhone/iPad il link si apre senza `download`: Safari mostra la scheda contatto da confermare.
  Altrove ha `download`: Android e desktop scaricano il file, che si apre nella rubrica.
- Dopo il clic: solo un'istruzione neutra ("Bekräfta där för att spara den") e il link di riserva
  "Ladda ner kontaktfilen", che genera la stessa vCard nel browser. Nessuna conferma di salvataggio.
- In sviluppo (`npm run dev`) il file statico non esiste: si usa il download generato nel browser.

## Fase 4 (archiviata): visitkort + webbplatser

Home con biglietto, galleria `/exempel`, `/tjänster`. Sostituita dalla fase 5; restano galleria ed esempi.
Punto di ripristino: tag git `restore/pre-reposition-20261026` (= commit 4862544, job Amplify 158).

## Fase 5: "una schermata alla volta", svedese e inglese

### Lingue e URL

- Svedese = URL esistenti senza prefisso; inglese sotto `/en` (`routes.ts`, una URL per schermata e lingua):
  `/` · `/en`, `/utforska` · `/en/explore`, `/webbplatser` · `/en/websites`, `/webbplatser/vart-satt` ·
  `/en/websites/our-approach`, `/digital-card` · `/en/digital-card`, `/tjänster` · `/en/services`, `/exempel` ·
  `/en/examples`, `/omOss` · `/en/about`, `/kontaktaOss` · `/en/contact`, `/jobbaMedOss` · `/en/careers`,
  `/integritet` · `/en/privacy`, `/card` · `/en/card`.
- Tutti i testi in `copy.ts` (sv è la fonte, en ha lo stesso tipo: una chiave mancante non compila). I testi dei
  biglietti in inglese stanno in `card.json` → `translations.en` (ruolo, tagline, dettagli, esempio, meta).
- Switch SV/EN (`LangSwitch.tsx`): sostituisce l'URL con quella equivalente mantenendo hash e `state`; salva
  la scelta in `localStorage` `mp-lang`. All'arrivo su un URL svedese con scelta "en" salvata si passa a
  `/en/…`; un link `/en/…` esplicito apre sempre in inglese. `/card` non cambia mai URL (destinazione NFC):
  l'interfaccia segue la scelta salvata.
- `<html lang>`, canonical, `hreflang` (sv, en, x-default) e Open Graph per schermata (`ScreenHead`); il build
  scrive `dist/<route>/index.html` per ogni schermata in entrambe le lingue (`build/static-route-meta.ts`).

### Schermate e movimento

- `/` è la copertina sopra Utforska (`screens/Hub.tsx`): trascinando verso l'alto la copertina segue il dito e
  Utforska (già montata, `inert`) passa da scala 0,98 e 12 px a 1 e 0; oltre il 26% dell'altezza (o con un
  colpo rapido) si apre, altrimenti torna giù. Anche tap/click sul comando, Enter, Spazio, PagGiù, rotella o
  trackpad. Aperta, l'URL diventa `/utforska`; Back o il logo la riabbassano. `pointercancel` = ritorno.
- Geografia (`nav.tsx`): Utforska al centro, Webbplatser → Vårt sätt a destra, Digitala visitkort → Vad som ingår
  a sinistra, Exempel in basso a sinistra, Om oss in basso, Kontakt in alto. La nuova schermata entra dal lato
  in cui si trova; tornando indietro il movimento è esattamente l'opposto. 460 ms, nessun rimbalzo.
- `Stage.tsx`: scroll a inizio schermata, ripristino con Back/Forward, focus sul titolo della nuova schermata,
  schermata uscente `inert`; con `prefers-reduced-motion` i cambi sono istantanei.
- Galleria e slide di Om oss (`useSwipe.ts`): solo movimenti chiaramente orizzontali, `touch-action: pan-y`;
  frecce, tastiera e contatore; nessun autoplay. Gli eventi non arrivano alla schermata.
- Desktop ≥ 1180 px: Webbplatser, Vårt sätt e Digitala visitkort affiancano testo e immagine per restare in una
  schermata; nessuna cornice di telefono.

### Moduli (API esistente)

- Wizard `/kontaktaOss` (`screens/Contact.tsx`): nome → servizio + descrizione (min 10, max 1900) → e-mail +
  consenso. Invio con `useSubmitMessage(false)` (POST `/clientsMessages`, `{ name, email, subject, textMessage }`).
  `subject` in svedese (`service.ts`); a `textMessage` si aggiungono righe di contesto (sito esistente sì/no,
  "Språk: engelska" dalla pagina inglese). Risposte in memoria (`wizardStore.ts`), mai in URL o storage;
  cancellate solo dopo una risposta positiva. Doppio invio bloccato; in caso di errore i dati restano.
- `/jobbaMedOss` (`screens/Jobs.tsx`): `useSubmitMessage(true)` → `/jobMessages` con CV, stesse regole di
  `formValidation.ts`.
- `components/ContactForm` non è più usato dal sito pubblico ma resta invariato.

### Cookie

- Banner pubblico (`ConsentBanner.tsx`): stessa chiave `cookieConsent` e stessa forma; "Bara nödvändiga" e
  "Tillåt statistik" con lo stesso peso, "Välj själv" con l'interruttore. Non blocca la pagina e non compare
  sopra la copertina. Clarity parte solo con `analytics: true` (anche `useClarity` invariato); revocando, i
  cookie `_clck`/`_clsk` vengono cancellati e la pagina ricaricata. Riaperto da "Cookieinställningar".
- Admin, login e Sido Butik mostrano ancora il banner precedente (`LegacyConsent.tsx`).
- Umami (`useUmami`, invariato) si carica sempre: lo script non scrive cookie né storage (legge solo
  `localStorage["umami.disabled"]`).

### Asset

`public/media/mambyly/`: WebP ricavati da `MambyLy_Claude_Pack/assets` (hero, tre copertine della galleria,
persone, anteprima siti, tre foto di Om oss). Font titoli: Newsreader (OFL, `src/public/assets/fonts`).
Il pacchetto `MambyLy_Claude_Pack/` non è nel repository.
