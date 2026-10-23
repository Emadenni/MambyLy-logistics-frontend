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
