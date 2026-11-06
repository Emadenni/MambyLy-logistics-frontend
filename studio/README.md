# Studio video (solo locale)

App Vite separata per produrre video social del biglietto digitale. Non fa parte della build del sito:
`vite build` parte solo da `index.html` nella radice, e `studio/out/` è escluso da git.

- `npm run studio` → anteprima in loop su http://127.0.0.1:5180 (`?format=<id>&variant=<id>`, `&t=<ms>` per un fotogramma fermo).
- `npm run studio:capture -- --format <id> [--variant all|reel|story|…] [--from ms --to ms]` → in
  `studio/out/<format>/`: `<variante>.mp4` (1080 × 1920, 30 fps, H.264, senza audio), `<variante>-sheet.png`
  (un fotogramma ogni 0,5 s, da sinistra a destra, per il controllo), `cover.png` e i PNG in `frames/`.

Cattura fotogramma per fotogramma: il Clock di Playwright guida timer e requestAnimationFrame, e ogni
transizione CSS della pagina (`document.getAnimations()`) viene messa in pausa al tempo esatto del
fotogramma. Ogni richiesta che non va al server locale dello studio viene bloccata (il resoconto la conta).
Usa il Chromium di Playwright se installato, altrimenti Chrome locale (`STUDIO_CHROME` per un altro percorso).

## Un nuovo video

1. Copia `formats/fran-papper-till-digitalt.ts` in `formats/<nuovo-id>.ts` e registralo in `formats/index.ts`.
2. Cambia solo la configurazione:
   - `layers`: testi (`caption`: `*parola*` = evidenziata, `\n` = a capo, `reveal` none/words/pop, `look`
     marker/box), biglietto di carta (`paper`), cestino (`bin`), card reale (`card`), evidenza su un
     controllo (`spotlight`), logo, freccia;
   - `actions`: click sui pulsanti veri della card (`flip`, `open-work`, `open-profile`, `open-contact`, `close-panel`);
   - `punches`: brevi zoom sui battiti; tempi con `b(n)` = battito n a 120 BPM;
   - `variants`: per esportazione (area sicura, testi, tempi, stile dei testi, ritmo); `cover`.
3. Per un altro settore: una nuova card in `cards/<slug>/card.ts` (dati fittizi, `demo: true`,
   `example.com`, nessun telefono), e nel formato `card: <nuovaCard>`.
4. `npm run studio:capture -- --format <nuovo-id>` e controlla i `*-sheet.png`.

## Regole

- `cards/` contiene card fittizie validate con `validateCard` del sito. Non stanno in
  `src/public/digital-card/cards/`, che viene pubblicata.
- La card è il vero `CardExperience`, senza modifiche: nessun accenno iniziale, nessuna inclinazione al
  passaggio del mouse (non ci sono movimenti del puntatore), servita su `studio.localhost`.
- Solo nello studio (`studio.scss`): il velo dietro al pannello è avorio sfocato invece che scuro, e alla
  chiusura il pannello viene tagliato sul battito (altrimenti si svuota mentre sfuma).

## Immagini social

`npm run studio:social` → PNG in `studio/out/social/` (`social.mjs`, scene in `social.tsx`): card singole 1600 px
su sfondo trasparente, card inclinata con ombra, mockup telefono 1080 × 1350. È sempre il vero `CardExperience`.
Il retro della card non ha un badge proprio: lo studio aggiunge lo stesso `.dc__badge` del fronte, solo in queste immagini.

## Schermate carosello

`npm run studio:carousel` → PNG 1170 × 2532 in `studio/out/carousel/`, dal sito pubblicato (il QR contiene l'indirizzo vero), in sola lettura.

## Video di prodotto (Remotion)

`studio/reel/` ha dipendenze proprie (`npm install` lì dentro) e licenza gratuita Remotion solo fino a 3 persone in totale.
Un video = un file `studio/reel/copioni/<id>.json`; da `studio/reel/`:

- `npm run record -- <id>` registra il sito (solo GET verso il sito) → `public/<id>/frames/` e `timeline.json` con tempi e coordinate. Va rilanciato solo se cambiano `actions` o la durata.
- `npm run render -- <id>` monta → `studio/out/` (nomi in `output`) più `<id>-sheet.png`, un fotogramma ogni 0,5 s. Basta da solo per testi, camera e note.
- `npm run preview` apre Remotion Studio.

Tutti i tempi sono in battiti (`beat`, 0,5 s a 120 BPM). `actions.do`: `tap`, `swipe` o `measure` (solo misura: niente dito, niente tocco).
`camera` zooma su un'azione, `captions` usa `*parola*` per l'evidenza e `\n` per andare a capo, `notes` disegna `circle`, `arrow` o `underline`.

### Video con storia (più riprese)

`copioni/reel-storia.json` ha `takes` (riprese reali: `start`, `actions`, `camera`, `notes`, `css` opzionale, tempi relativi alla ripresa), `scenes` (`hook`, `problem`, `phone` con `take`/`takeFrom`, `close`; `enter`: `match`, `whip`, `scale`; `label`: es. "Koncept") e `captions` (tempi del video). `reel-storia-15s.json` riusa le stesse riprese con `recording`: ha solo `scenes` e `captions`.
`npm run record -- reel-storia main,opened` registra solo le riprese indicate. Testi, ordine delle scene, camera e note: basta `npm run render -- <id>`.
