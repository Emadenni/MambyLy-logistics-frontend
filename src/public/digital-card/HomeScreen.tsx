import React, { useState } from "react";
import { Dialog } from "@mui/material";
import { FiCopy, FiX } from "react-icons/fi";
import type { CardConfig } from "./types";
import { copyText } from "./share";
import { guideKind, isStandalone, promptInstall, type GuideKind } from "./install";

type Guide = { title: string; steps: string[]; note?: string };
type HomeCopy = {
  add: string;
  accepted: string;
  dismissed: string;
  vsContact: string;
  copy: string;
  copied: string;
  close: string;
  guides: Record<GuideKind, Guide>;
};

const copy: Record<"sv" | "en" | "it", HomeCopy> = {
  sv: {
    add: "Lägg till på hemskärmen",
    accepted: "Bekräftat. Webbläsaren lägger till kortet på den här enheten.",
    dismissed: "Kortet lades inte till. Du kan försöka igen när du vill.",
    vsContact: "Det här lägger till en genväg till kortet. ”Spara kontakt” är något annat: det sparar uppgifterna i kontakterna.",
    copy: "Kopiera länk",
    copied: "Länken är kopierad.",
    close: "Stäng",
    guides: {
      "ios-safari": {
        title: "Lägg till på hemskärmen",
        steps: ["Tryck på Dela i Safari. Ser du den inte öppnar du först menyn ⋯.", "Välj ”Lägg till på hemskärmen”. Du kan behöva rulla eller trycka på ”Mer”.", "Bekräfta med ”Lägg till”."],
      },
      "ios-browser": {
        title: "Lägg till på hemskärmen",
        steps: ["Tryck på Dela i webbläsarens meny.", "Välj ”Lägg till på hemskärmen”.", "Bekräfta med ”Lägg till”."],
        note: "Om alternativet saknas kopierar du länken och öppnar den i Safari.",
      },
      "in-app": {
        title: "Öppna i webbläsaren först",
        steps: ["Öppna den här appens meny (⋯ eller ⋮).", "Välj ”Öppna i webbläsare”, ”Öppna i Safari” eller ”Öppna i Chrome”.", "I webbläsaren trycker du på ”Lägg till på hemskärmen” igen."],
        note: "Saknas alternativet? Kopiera länken och klistra in den i webbläsaren.",
      },
      android: {
        title: "Lägg till på hemskärmen",
        steps: ["Öppna webbläsarens meny (⋮ eller ☰).", "Välj ”Lägg till på startskärmen” eller ”Installera app”.", "Bekräfta när du blir tillfrågad."],
        note: "Om alternativet saknas kopierar du länken och öppnar den i Chrome.",
      },
      desktop: {
        title: "Lägg till från telefonen",
        steps: ["Skanna koden med telefonen.", "Tryck på ”Lägg till på hemskärmen” på kortet."],
      },
    },
  },
  en: {
    add: "Add to Home Screen",
    accepted: "Confirmed. Your browser is adding the card to this device.",
    dismissed: "The card was not added. You can try again whenever you like.",
    vsContact: "This adds a shortcut to the card. “Save contact” is separate: it puts the details in your address book.",
    copy: "Copy link",
    copied: "The link is copied.",
    close: "Close",
    guides: {
      "ios-safari": {
        title: "Add to Home Screen",
        steps: ["Tap Share in Safari. If you don’t see it, open the ⋯ menu first.", "Choose “Add to Home Screen”. You may have to scroll or tap “More”.", "Tap “Add” to confirm."],
      },
      "ios-browser": {
        title: "Add to Home Screen",
        steps: ["Tap Share in your browser’s menu.", "Choose “Add to Home Screen”.", "Tap “Add” to confirm."],
        note: "If the option isn’t listed, copy the link and open it in Safari.",
      },
      "in-app": {
        title: "Open in your browser first",
        steps: ["Open this app’s menu (⋯ or ⋮).", "Choose “Open in browser”, “Open in Safari” or “Open in Chrome”.", "In the browser, tap “Add to Home Screen” again."],
        note: "No such option? Copy the link and paste it into your browser.",
      },
      android: {
        title: "Add to Home Screen",
        steps: ["Open your browser’s menu (⋮ or ☰).", "Choose “Add to Home screen” or “Install app”.", "Confirm when asked."],
        note: "If the option isn’t listed, copy the link and open it in Chrome.",
      },
      desktop: {
        title: "Add it on your phone",
        steps: ["Scan the code with your phone.", "On the card, tap “Add to Home Screen”."],
      },
    },
  },
  it: {
    add: "Aggiungi alla Home",
    accepted: "Confermato. Il browser sta aggiungendo il biglietto a questo dispositivo.",
    dismissed: "Il biglietto non è stato aggiunto. Puoi riprovare quando vuoi.",
    vsContact: "Così aggiungi un accesso rapido al biglietto. Salvare il contatto è un’altra cosa: inserisce i dati in rubrica.",
    copy: "Copia il link",
    copied: "Il link è stato copiato.",
    close: "Chiudi",
    guides: {
      "ios-safari": {
        title: "Aggiungi alla Home",
        steps: ["Tocca Condividi in Safari. Se non lo vedi, apri prima il menu ⋯.", "Scegli “Aggiungi alla schermata Home”. Potrebbe servire scorrere o toccare “Altro”.", "Tocca “Aggiungi” per confermare."],
      },
      "ios-browser": {
        title: "Aggiungi alla Home",
        steps: ["Tocca Condividi nel menu del browser.", "Scegli “Aggiungi alla schermata Home”.", "Tocca “Aggiungi” per confermare."],
        note: "Se l’opzione non compare, copia il link e aprilo in Safari.",
      },
      "in-app": {
        title: "Prima apri nel browser",
        steps: ["Apri il menu di questa app (⋯ o ⋮).", "Scegli “Apri nel browser”, “Apri in Safari” o “Apri in Chrome”.", "Nel browser, tocca di nuovo “Aggiungi alla Home”."],
        note: "Non trovi l’opzione? Copia il link e incollalo nel browser.",
      },
      android: {
        title: "Aggiungi alla Home",
        steps: ["Apri il menu del browser (⋮ o ☰).", "Scegli “Aggiungi a schermata Home” o “Installa app”.", "Conferma quando richiesto."],
        note: "Se l’opzione non compare, copia il link e aprilo in Chrome.",
      },
      desktop: {
        title: "Aggiungilo dal telefono",
        steps: ["Inquadra il codice con il telefono.", "Sul biglietto, tocca “Aggiungi alla Home”."],
      },
    },
  },
};

/** The site has no Italian pages: a phone set to Italian gets this one control in Italian. */
const homeLang = (lang: CardConfig["lang"]) => (typeof navigator !== "undefined" && /^it\b/i.test(navigator.language) ? "it" : lang);

/** The quiet control under the card's actions, and the instructions when there is no native prompt. */
const HomeScreen: React.FC<{
  card: CardConfig;
  url: string;
  qrSrc: string;
  qrAlt: string;
  onStatus: (status: { tone: "ok" | "info"; text: string }) => void;
}> = ({ card, url, qrSrc, qrAlt, onStatus }) => {
  const [standalone] = useState(isStandalone);
  const [guide, setGuide] = useState<GuideKind | null>(null);
  const [lastGuide, setLastGuide] = useState<GuideKind>("android");
  const [copied, setCopied] = useState<"copied" | "failed" | null>(null);
  const t = copy[homeLang(card.lang)];
  if (standalone) return null;

  const add = () => {
    void promptInstall().then((result) => {
      if (result === "accepted") onStatus({ tone: "ok", text: t.accepted });
      else if (result === "dismissed") onStatus({ tone: "info", text: t.dismissed });
      else {
        const kind = guideKind();
        setCopied(null);
        setLastGuide(kind);
        setGuide(kind);
      }
    });
  };

  const close = () => setGuide(null);
  const shown = t.guides[lastGuide];
  const titleId = `dc-home-title-${card.slug}`;
  // Pages inside another app, or a browser that may lack the option, need the link to move on.
  const offerCopy = lastGuide === "in-app" || lastGuide === "ios-browser" || lastGuide === "android";

  return (
    <>
      <button type="button" className="dc-home" onClick={add} aria-haspopup="dialog">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
          <path d="M12 8.5v7M8.5 12h7" />
        </svg>
        {t.add}
      </button>
      <Dialog open={guide !== null} onClose={close} className="mp-dialog" aria-labelledby={titleId} PaperProps={{ className: "mp-dialog__paper mp-dialog__paper--narrow" }}>
        <button type="button" className="mp-dialog__close" onClick={close} aria-label={t.close}>
          <FiX aria-hidden="true" />
        </button>
        <div className="mp-dialog__body dc-qr dc-homeguide" lang={homeLang(card.lang)}>
          <h2 id={titleId}>{shown.title}</h2>
          {lastGuide === "desktop" && <img className="dc-qr__code" src={qrSrc} alt={qrAlt} width={168} height={168} />}
          <ol>
            {shown.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          {shown.note && <p>{shown.note}</p>}
          {offerCopy && (
            <>
              <button type="button" className="mp-btn" onClick={() => void copyText(url).then(setCopied)}>
                <FiCopy aria-hidden="true" /> {t.copy}
              </button>
              <p role="status">{copied === "copied" ? t.copied : copied === "failed" ? url : ""}</p>
            </>
          )}
          <p className="dc-homeguide__quiet">{t.vsContact}</p>
        </div>
      </Dialog>
    </>
  );
};

export default HomeScreen;
