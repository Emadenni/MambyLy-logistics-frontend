# Contatti pubblici: diagnosi della mancata ricezione (28 ottobre 2026)

Verifica in sola lettura di codice, configurazione AWS e log. Nessun nuovo invio reale, nessuna modifica a
backend, Lambda, tabelle, DNS o variabili di produzione. Nessun dato personale riportato qui.

## Percorso verificato

1. Wizard `/kontaktaOss` → validazione nel browser (nome 2–100, messaggio 10–1900 + righe di contesto, e-mail,
   consenso) → `submitContact` (prima `useSubmitMessage`).
2. Build Amplify (app `d1g4dp1fn4kids`, branch `dev`): la build spec scrive
   `VITE_API_BASE_URL=https://uyhokr7waa.execute-api.eu-north-1.amazonaws.com`. Ambiente corretto.
3. API Gateway HTTP `prod-MambyLy-Logistics` (CORS `*`): `POST /clientsMessages` → Lambda
   `MambyLy-Logistics-prod-postClientMessage` (Node 20, ultimo aggiornamento 29 marzo 2025).
4. Lambda: validazione Joi (name 2–100, email, subject 3–255, textMessage 10–2000) → `PutItem` nella tabella
   DynamoDB `clients-messages-table-prod` → risposta 201 `{ success: true, message, messageId }`.
5. Notifica: **nessuna**. La Lambda non chiama Brevo, SES, SMTP né altri servizi; tra le sue variabili d'ambiente
   non c'è alcuna credenziale di posta; la tabella non ha stream né trigger. Brevo/e-mail compaiono solo nelle
   funzioni di un altro progetto nello stesso account, non in MambyLy.

## Prova sull'invio segnalato

- Log della Lambda: un'unica invocazione il 27 ottobre 2026 alle 20:23:14 UTC, durata 139 ms, nessun errore.
- DynamoDB: un elemento con `sentAt` 2026-10-27T20:23:14Z e oggetto "Digitalt visitkort + webbplats".

## Causa

La richiesta è arrivata ed è stata salvata. Non arriva nessuna e-mail perché il backend attuale non prevede
alcuna notifica: le richieste sono visibili solo nel database e nel pannello admin (`GET /clientsMessages`).
Non è un problema di chiave Brevo, di endpoint o di frontend.

Indirizzo: `mambylysolutions.com` non esiste (NXDOMAIN); `mambylysolutions.se` ha MX Zoho. L'indirizzo pubblico
resta `info@mambylysolutions.se`. La casella non è stata verificata da qui.

## Cosa è stato corretto nel frontend

- Adattatore unico `src/public/contactSubmit.ts`: successo solo con `success: true`, errori distinti, timeout,
  offline, nessun reset su errore, nessun doppio invio. La conferma dice "Vi har tagit emot din förfrågan"
  (ricevuta), non "e-mail consegnata".

## Per ricevere le richieste per e-mail (decisione del titolare)

- **A. Notifica nel backend esistente**: aggiungere alla Lambda un invio (es. SES o Brevo) dopo il salvataggio.
  È una modifica del backend, fuori dal perimetro autorizzato: non fatta.
- **B. Formspree** (preparato, inattivo): servono un endpoint `https://formspree.io/f/<id>` creato dal titolare
  con destinatario verificato, poi `VITE_CONTACT_PROVIDER=formspree` e `VITE_FORMSPREE_ENDPOINT` nella build, e
  l'aggiornamento dell'informativa. Con Formspree le richieste non finiscono più nel database/admin.
- Nel frattempo: controllare le richieste nel pannello admin.

Una prova end-to-end reale (invio + ricezione in casella) richiede un'istruzione esplicita e non è stata fatta.
