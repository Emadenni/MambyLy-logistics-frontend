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
e un menu compatto verso il sito (Exempel, Så funkar det → `/#sa-funkar-det`, Webbplatser → `/#webbplats`,
Kontakt). Le ancore sono gestite da `src/public/components/useHashScroll.ts`.

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

## Riposizionamento: visitkort + webbplatser (fase 4)

- Home (`PublicHome.tsx`): apertura con biglietto interattivo, benefici (`#fordelar`), come funziona
  (`#sa-funkar-det`), esempi (`#exempel`), sito coordinato (`#webbplats`), domande (`#fragor`), contatto con
  servizio preselezionato (`#kontakt`). NFC solo come nota nelle FAQ, non offerto.
- Galleria `/exempel` e schermate `/exempel/<slug>` (pulite, "Exempel · påhittade uppgifter", ritorno alla
  galleria, "Jag vill ha ett kort som det här" → contatto con il modello). Esempi: `kvist-och-hyvel`
  (hantverkare), `fjardvik-agentur` (säljare/konsult), `studio-halvljus` (fotograf), `rutglans`
  (serviceföretag), `exempelbageriet`. Dati e loghi inventati, domini `.example`, telefono segnaposto.
- `/tjänster`: due servizi (visitkort principale, webbplats complementare), nessun prezzo (offerta).
- Percorsi vecchi: `/digital-card` → `/tjänster#visitkort`; `/card/<demo>` → `/exempel/<demo>`.
- Anteprime social `public/brand/og-home.png`, `og-exempel.png`, `public/cards/<slug>/og.png`: screenshot del
  componente reale, composti dal sito in anteprima locale con Chrome headless.
- Il build scrive `dist/<pagina>/index.html` per tutte le pagine pubbliche: Amplify aggiunge lo slash finale e
  senza un file reale rispondeva 404 (con la SPA comunque visibile).
- Punto di ripristino: tag git `restore/pre-reposition-20261026` (= commit 4862544, job Amplify 158).
