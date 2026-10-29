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

Sotto il biglietto, in un unico gruppo: il suggerimento breve "Svep upp för att dela · Tryck för att vända"
(solo su schermo touch con Web Share) e una piccola barra di azioni del biglietto (`role=group`, non la
navigazione del sito). "Spara kontakt" è l'azione primaria piena; sotto ~336px di larghezza resta l'icona con il
nome accessibile. Seguono pulsanti tondi da 44px solo icona, con etichetta e tooltip: Dela kortet (sempre
presente), Visa baksidan / Visa framsidan (`aria-pressed`), Visa QR-kod, Visa helskärm. I colori vengono dai token
`--dcx-*` su `.dc-experience--<design>`: velvet champagne, ivory verde profondo, white blu, oxblood crema,
graphite argento, expressive viola, `brand` per MambyLy. Sul biglietto MambyLy segue il menu espandibile "Mer från MambyLy" (chiuso all'inizio, `aria-expanded`, Escape lo chiude): Webbplatser,
Digitala visitkort, Exempel, Om oss, Kontakt, dalla lista condivisa `destinations` in `experience/nav.tsx`, nella
lingua dell'interfaccia. In alto a destra lo switch SV/EN.

Accenno iniziale: breve inclinazione (≈1,25 s) su un wrapper `.dc__tilt` separato dalle trasformazioni di
trascinamento e rotazione; una volta per scheda (`sessionStorage`), si interrompe al primo tocco/tasto/focus,
disattivato con `prefers-reduced-motion`.

Gesti (`DigitalCard.tsx`): l'asse si decide una volta sola, dopo 8px.
- Orizzontale: gira il biglietto, come prima.
- Verticale (solo touch o penna, con `|dy| > 1,2·|dx|`): la card si solleva un poco e non gira mai. Al rilascio,
  se `dy < -56px` e (velocità < -0,4 px/ms oppure `dy < -110px`), `onSwipeUp` viene chiamato dentro `pointerup`.
  Così `navigator.share()` parte senza attese e conserva l'attivazione utente.
- Un gesto quindi gira oppure condivide, mai le due cose. `pointercancel` riporta la card al suo posto, un secondo
  dito non avvia nulla e si apre un solo pannello alla volta.

Lo swipe era stato tolto in d622dc5 (`touch-action: pan-y`). Ora la card usa `touch-action: pinch-zoom`: la
pagina scorre toccando fuori dalla card.

Condivisione:
- Se l'utente chiude il pannello senza condividere, non compare nulla.
- Se Web Share manca, o il browser rifiuta la chiamata (NotAllowedError, per esempio quando non accetta lo swipe
  come gesto), compare un pannello discreto con l'URL e "Kopiera länk". La conferma appare solo se la copia è
  avvenuta davvero.
- In "solo biglietto" suggerimento e barra sono nascosti, e lo swipe condivide solo se il dispositivo ha Web Share.

Test: `card-e2e.mjs` nello scratchpad, con condivisione simulata.

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

## Fase 6: demo reali, tre biglietti, navigazione rapida

Asset: `MambyLy_Demo_Assets_v2/` (non pubblicato, in `.gitignore`); in `public/media/mambyly/` solo i WebP usati:
`site-<stile>-{900,1600}`, `card-<stile>-1300`, `preview-<stile>-{desktop-640,desktop-1280,mobile-390}`.

### Cinque demo web (`src/public/experience/concepts/`)

- Rotte: `/webbplatser/koncept/<slug>` · `/en/websites/concepts/<slug>` (`routes.ts` → `CONCEPTS`):
  redaktionell/editorial, typografisk/typographic, minimal, visuell/visual, interaktiv/interactive.
  Schermo intero, `noindex`, file statici generati dal build, contenuti fittizi dichiarati.
- Ogni stile ha layout e comportamento propri: editoriale (reportage, planimetria con stanze che aprono i
  dettagli, materiali, richiesta di visita), tipografico (programma culturale, filtri per tipo e giorno, voci che si
  aprono, "Min kväll"), minimale (prodotto: taglia, luce del mattino/sera, lampada che si accende, borsa), visivo
  (foto immersiva, momenti, calendario con disponibilità simulata in tre passi), interattivo (tre scelte che
  cambiano scultura, colore, forme e testo).
- I moduli delle demo non fanno richieste di rete: rispondono nel browser ("demo – inget skickades").
- Testi in `concepts/content.ts` (sv/en). Unico elemento MambyLy: la barra di uscita (`ExitBar`).
- Anteprime della galleria = screenshot reali delle demo finite (desktop 1440×900 e telefono 390×844, motion
  ridotto, barra di uscita nascosta), generati con Chrome headless e convertiti in WebP. Se una demo cambia,
  rigenerare le anteprime.

### Tre biglietti di esempio

- `cards/professionell`, `cards/redaktionell`, `cards/expressiv` (persone fittizie, nessun numero di telefono,
  e-mail `@example.com`). I cinque esempi precedenti sono stati rimossi; i loro link portano a `/exempel`.
- `theme.background` (nuovo, facoltativo): nome di un'immagine `card-<nome>-1300.webp` come superficie del fronte;
  i testi restano HTML sopra l'immagine.
- `/exempel/<slug>`: il biglietto a schermo intero sulla superficie del suo stile, con tutte le azioni
  (girare, salva contatto con i dati fittizi, condividi, QR) e la barra di uscita verso `/exempel`.

### Navigazione rapida (`QuickNav.tsx`)

- Barra sospesa in basso: Utforska · Webbplatser · Visitkort · Om oss (EN: Explore · Websites · Digital cards ·
  About). Link diretti, sezione attiva con punto verde e `aria-current` (`page` sulla schermata stessa, `true`
  nelle sottopagine). Kontakt resta in alto.
- Nascosta sulla copertina, nelle demo e nei biglietti a schermo intero (lì c'è la barra di uscita) e su `/card`
  (ha il suo menu). Su telefono si sposta quando la tastiera è aperta (campo di testo con il focus).
- Spazio riservato: `.has-qnav .mp-screen { padding-bottom: var(--qnav-space) }` (safe-area inclusa).
- Utforska sta in una schermata a 390×844 e a 1440×900 (servizi, Om oss e piè di pagina).

### Copertina

- Simbolo: due maglie intrecciate (`icons.tsx` → `LinkMark`).
- Apertura: Utforska resta ferma dietro; la copertina si apre con una maschera dal centro verso i lati che segue il
  dito (`mask-image` legato al progresso del gesto). Un anello sottile si espande dall'impronta durante il
  gesto, al tocco e, ogni tanto, da fermo (mai con motion ridotto).

### Contatto

- Nel wizard e nel messaggio di errore l'alternativa è l'e-mail `info@mambylysolutions.se` (stesso dominio del
  sito, già usata in policy e su `/card`) al posto del telefono. WhatsApp resta. Il biglietto `/card` mantiene i
  suoi dati reali.

## Fase 7: contatti, sei siti, sei biglietti, desktop compatto

Specifica: `MambyLy_Claudio_Final/` (non pubblicato, in `.gitignore`). Prevale sulle fasi precedenti dove diverge.
Diagnosi dei contatti: `docs/CONTACT-DELIVERY.md`.

### Contatti (`src/public/contactSubmit.ts`)

- Un solo adattatore per i contatti pubblici (wizard; web, biglietto e richieste generiche). Stesso endpoint e
  payload dell'hook esistente: `POST {VITE_API_BASE_URL}/clientsMessages` con `{ name, email, subject, textMessage }`.
  `useSubmitMessage` resta invariato per `/jobMessages` e per il vecchio `ContactForm`.
- Successo solo con `{ success: true }` (il backend risponde 201 `{ success, message, messageId }`); HTTP 200 senza
  `success: true` o con corpo non JSON è un errore. Esiti distinti: `invalid` (400/422), `busy` (429), `server`,
  `offline` (nessuna richiesta partita), `unknown` (timeout 15 s o richiesta respinta: forse arrivata; il testo
  invita a scrivere per e-mail invece di reinviare, il pulsante diventa "Skicka ändå igen").
- Risposte conservate su ogni errore, doppio invio bloccato, nessun dato in URL, analytics o localStorage.
- Formspree preparato e **inattivo**: si attiva solo con `VITE_CONTACT_PROVIDER=formspree` e un
  `VITE_FORMSPREE_ENDPOINT` reale `https://formspree.io/f/<id>`. Un provider per richiesta, nessun fallback.
  Contratto dalla libreria ufficiale `@formspree/core` 4.0.0: `Accept: application/json`, successo con `next`,
  errori in `errors[]`/`error`. Se si attiva, aggiornare l'informativa (fornitore e flusso dei dati).
- Test: `src/__tests__/contactSubmit.test.ts` (contratto, 400/401/403/422/429/500, 200 con errore, non JSON,
  offline, timeout, selezione del provider). Telefono e WhatsApp tolti dal percorso pubblico (resta il pulsante
  WhatsApp sulle pagine legacy: login, admin, Sido Butik). `/card` mantiene i suoi dati.

### Sei siti (`src/public/experience/concepts/`)

| Rotta SV · EN | Componente | Note |
|---|---|---|
| `restaurang` · `restaurant` | `Restaurant.tsx` | Menu un piatto alla volta (7 piatti, una sola foto), allergeni in disclosure, prenotazione e "Hitta hit" dimostrative |
| `fotograf` · `photographer` | `Photographer.tsx` | Provino come navigazione, serie a schermo intero (frecce, tastiera, Esc), conteggi reali (4 foto) |
| `transport` · `transport` | `Logistics.tsx` | Percorso ritiro → consegna che mostra i luoghi digitati, riepilogo senza prezzo né prenotazione, link in basso senza hamburger |
| `maleri` · `painting` | `Painter.tsx` | Prima/dopo con `input type=range` nativo; "Fasad" e "Tapetsering" senza foto finte |
| `arkitektur` · `architecture` | `Architecture.tsx` | Demo editoriale conservata (planimetria, stanze, materiali), link sempre visibili invece dell'hamburger |
| `belysning` · `lighting` | `Lighting.tsx` | Demo minimal conservata senza borsa né acquisto: Tänd/Släck, taglia, luce, collezione, "Fråga om produkten" |

- Vecchie slug: `redaktionell`/`editorial` → arkitektur, `minimal` → belysning, le altre → `/webbplatser`
  (`RETIRED_CONCEPTS` in `routes.ts`).
- Prima/dopo dell'imbianchino: lo studio del pacchetto non è allineato al pixel. Il "dopo" è ricavato dalla metà
  "prima" (stessa foto) ricolorando solo le pareti con una maschera (poligoni + colore) e un moltiplicatore per
  canale misurato sullo studio; dichiarato in pagina come simulazione di design.
- Ogni demo: `ConceptFrame` con `DemoNote` (nessun invio) e `cx-want` ("Vill du ha en sådan här webbplats?" →
  wizard vero con contesto `site`), barra di uscita, SV/EN, `noindex`.
- Galleria: `Carousel.tsx` (scroll nativo con snap, frecce, indice 01/06, posizione ricordata nella scheda).
  Anteprime `preview-<id>-{mobile-390,desktop-640,desktop-1280}.webp` = screenshot reali delle demo (motion ridotto,
  barra di uscita nascosta). Rigenerarle se una demo cambia.

### Sei biglietti (`digital-card/StyleCard.tsx`, `styles/_style-cards.scss`)

- `cards/<slug>/card.json` con il nuovo campo `design`: alex-lind (ivory), sam-berg (velvet), robin-ek (white),
  kim-dahl (oxblood), charlie-holm (graphite), jamie-lund (expressive). Persone fittizie, `@example.com`, nessun
  telefono. Vecchie slug: professionell → alex-lind, redaktionell → kim-dahl, expressiv → jamie-lund.
- Materiali solo CSS/SVG (una grana SVG leggera), dimensioni in `em` scalate con container query: la stessa faccia
  serve per la galleria (`mini`) e per la pagina intera.
- Funzioni: vCard costruita dai dati del biglietto, condivisione Web Share con copia del link come alternativa,
  QR generato dall'URL della pagina del biglietto nella lingua corrente, "Mer" in disclosure, e-mail che spiega
  la demo. Il motore a doppia faccia (`DigitalCard`/`CardExperience`) resta per `/card` e i biglietti reali.

### Layout

- Desktop: la stessa colonna centrale del telefono (`--x-frame: 600px`); rimossi i layout a due colonne di hub,
  metodo, biglietti e `/card`. Su schermi desktop alti meno di 880px Utforska usa 440px.
- Footer: disclosure "Info & integritet" chiusa di default (Esc chiude e riporta il focus).
- Vuoto sotto il footer: durante una transizione il layer uscente condivideva la cella della griglia e teneva la
  pagina alta quanto la schermata precedente (misurato: da `/webbplatser` a Utforska la pagina restava alta per
  ~460 ms). Ora il layer uscente è fuori flusso e ritagliato (`.mp-stage { overflow: clip }`), e la posizione di
  scroll da ripristinare con Indietro viene letta prima della modifica del DOM.
- Umami parte solo con il consenso alle statistiche (come Clarity).

## Fase 8: demo immersive, menu a icone, menu ristorante, biglietti sul modello /card

Specifica: `MambyLy_Corrections_Menu/` (non pubblicato) e le correzioni successive del titolare. Prevale sulla Fase 7.

- **Demo immersive** (sei siti e sei biglietti): dentro c'è solo l'esperienza più `ExitButton`
  (`ConceptChrome.tsx`): un pulsante di 44px in alto a destra, "Tillbaka till galleriet" / "Back to gallery",
  tooltip su hover e focus, safe-area. Torna indietro nella cronologia se la galleria è la voce precedente
  (posizione conservata), altrimenti è un link alla galleria. Tolti barra di uscita, switch lingua, footer e
  CTA MambyLy dalle demo. Le testate delle demo lasciano libero l'angolo del pulsante.
- **Lingua**: la lingua di una demo o di un biglietto è quella dell'indirizzo; `Stage` non la cambia più per
  una preferenza salvata (`explicit` per `concept`, `example`, `card`). Anteprime per lingua:
  `preview-<sv|en>-<id>-{desktop-640,desktop-1280,mobile-390}.webp` (screenshot reali, `prevgen.mjs`).
- **Menu**: `NavMenu.tsx` sostituisce la barra inferiore (`QuickNav` rimosso). Pulsante bussola nell'header
  (`aria-expanded`, nome "Öppna/Stäng navigering"), tendina `<nav>` di cinque icone (Utforska, Webbplatser,
  Digitala visitkort, Om oss, Kontakt) con nome accessibile e tooltip, `aria-current="page"`; chiude con una
  scelta, Escape (focus al pulsante) e click fuori. Sotto 430px Kontakt diventa un pulsante rotondo con busta.
- **Ristorante**: `concepts/restaurant-menu.json` = `MENU_SV_EN.json` (sei piatti, categorie, prezzi, ingredienti
  e allergeni illustrativi) con il nome del media al posto del percorso. Foto `dish-<id>-{480,900}.webp`, ritagli
  quadrati con la stessa scala, nessuna maschera circolare né segnaposto. Contatore per categoria (2/3/1).
- **Biglietti**: i sei esempi usano il motore di `/card` (`DigitalCard`/`CardExperience`: 85 × 55, fronte/retro,
  rotazione, vCard, QR, condivisione). `card.json` → `design` aggiunge `.dc--d-<design>` (`_card-designs.scss`:
  materiale, tipografia e composizione) e un monogramma. `StyleCard` (versione verticale) rimosso. QR e link
  dei biglietti demo puntano alla pagina nella lingua mostrata.
- **"Visa helskärm"** (`CardExperience` → `useFullscreen`, vale per `/card` e per i sei esempi): lo stesso
  elemento biglietto alla misura massima visibile, solo un pulsante di chiusura; Fullscreen API chiesta dal
  clic se disponibile, altrimenti vista immersiva nell'area del browser; in verticale resta orizzontale con
  "Vrid telefonen…"; esce con pulsante, Escape, uscita del browser dal fullscreen e Indietro; focus restituito.
- **Metodo**: una sola schermata (titolo, introduzione, anteprima nella lingua corrente accanto ai tre passaggi,
  una frase sulle possibilità, una nota, una CTA verso il wizard con contesto `site`). Nessuna scelta.

## Fase 9: settima demo, titolo del ristorante, materiali dei biglietti

- **Settima demo**: `Typographic.tsx` (concept tipografico rosso, foto `site-typographic`, dalla versione
  d0e8100) di nuovo in galleria come "Typografiskt koncept" / "Typographic concept", slug
  `typografisk` / `typographic`, immersiva come le altre; programma fittizio rinominato "Höstprogrammet".
- **Ristorante**: la parola di categoria sta intera sopra la foto (altezza fissa, nessun salto tra le
  categorie); gli scatti non permettono uno scontorno pulito del piatto, quindi niente sovrapposizione.
- **Biglietti**: un materiale SVG per design su tutta la superficie, fronte e retro (`$m-*` in
  `_card-designs.scss`, generati da rilievo con luce diffusa, fibre, satinatura o grana opaca).
- **Contatti**: `contactSubmit.ts` incorpora solo le tre variabili che usa. Per i test locali compilare con
  `VITE_API_BASE_URL=https://execute-api.invalid` (mai la build di produzione dietro un mock).

## Fase 10: fondo di Utforska, materiali e dettagli dei biglietti

- **Fondo pagina**: misurato sul sito pubblicato (ingresso diretto, dalla copertina, ritorno dalle demo,
  footer aperto/chiuso, barre del browser, rotazione, 320–412px): il documento finisce sempre al footer,
  nessun overflow. Lo spazio visibile veniva dal rimbalzo del browser oltre la fine (overscroll) e dalla
  banda vuota sopra il footer sui telefoni alti. Ora `html:has(.mp-x) { overscroll-behavior-y: none }`, il
  contenuto di Utforska è centrato nell'altezza libera e il footer conta la safe-area una sola volta.
- **Biglietti**: velluto più fine e senza lucido (nero), pelle finissima sul retro nero del biglietto bianco,
  carta satinata con profondità tonale (viola); un simbolo della professione per card (Lucide: bussola,
  pennino, diaframma, circuito, scintille; l'avorio ha già l'arco) e un dettaglio a secco (cornice avorio,
  filetto bianco e rosso). Tutto in `_card-designs.scss`, generato da `materials2.cjs` (scratchpad).

## Fase 11: Utforska in una schermata, footer semplice, materiali visibili

- **Footer**: niente più tendina; i collegamenti legali sono sempre visibili in una riga compatta che va a
  capo (`ScreenFooter`), con la safe-area contata una volta.
- **Utforska**: per altezze ≥ 500px lo schermo è una griglia `auto / 1fr / auto` con `min-height: 100dvh`
  (non sommata a header e footer); titoli, lead, immagini e "Om oss" prendono le misure anche
  dall'altezza (`dvh`). Sotto 700px sparisce la frase secondaria del pannello biglietti, sotto 600px il lead
  dei siti e il © (presente su tutte le altre pagine). Sotto 500px (orizzontale, zoom) la pagina scorre.
  Misurato `scrollHeight` = `clientHeight` da 375×553 a 1920×1080, SV ed EN.
- **Biglietti**: velluto nero rifatto come peluria morbida sfumata (niente punti chiari) con zone di velluto
  schiacciato; viola con trama satinata più ampia e profondità tonale; simboli un po' più grandi.
