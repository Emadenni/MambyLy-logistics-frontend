import React, { useId, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiChevronRight, FiCopy, FiMail, FiMoreHorizontal, FiShare2, FiUserPlus, FiX } from "react-icons/fi";
import LangSwitch from "../experience/LangSwitch";
import { examplePath } from "./registry";
import { qrSvg } from "./qr";
import { copyText, shareLink } from "./share";
import type { CardConfig, CardDesign } from "./types";
import { downloadVCard } from "./vcard";

type Lang = "sv" | "en";

const strings = {
  sv: {
    save: "Spara kontakt",
    email: "E-post",
    share: "Dela",
    more: "Mer",
    less: "Stäng",
    saved: "Kontaktfilen har skapats – med påhittade uppgifter.",
    emailNote: "Demo: adressen är påhittad (example.com). Inget mejl skickas.",
    copied: "Länken till kortet är kopierad.",
    shared: "Kortet har delats.",
    copyFailed: "Kunde inte kopiera. Länken: {url}",
    moreTitle: "Mer om {name}",
    website: "Webbplats (exempel)",
    qr: "QR-kod till just det här kortet",
    copy: "Kopiera länk",
    demo: "Påhittad person – ett exempel från MambyLy.",
    actions: "Kortets funktioner",
  },
  en: {
    save: "Save contact",
    email: "Email",
    share: "Share",
    more: "More",
    less: "Close",
    saved: "The contact file was created – with made-up details.",
    emailNote: "Demo: the address is made up (example.com). No email is sent.",
    copied: "The link to the card is copied.",
    shared: "The card was shared.",
    copyFailed: "Could not copy. The link: {url}",
    moreTitle: "More about {name}",
    website: "Website (example)",
    qr: "QR code for this very card",
    copy: "Copy link",
    demo: "A made-up person – an example by MambyLy.",
    actions: "Card actions",
  },
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** Absolute URL of this demo card in the given language (also what its QR code holds). */
export const styleCardUrl = (slug: string, lang: Lang) => `${window.location.origin}${examplePath(slug, lang)}`;

/** Small visual detail of the ivory card: an arch with a branch, drawn in SVG (no photo). */
const Arch: React.FC = () => (
  <svg className="sc__arch" viewBox="0 0 100 160" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="sc-arch" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#cfc6b3" />
        <stop offset="1" stopColor="#9d9480" />
      </linearGradient>
    </defs>
    <rect width="100" height="160" fill="url(#sc-arch)" />
    <path d="M18 160 V70 a32 32 0 0 1 64 0 V160 Z" fill="#e9e2d2" />
    <path d="M30 160 V74 a20 20 0 0 1 40 0 V160 Z" fill="#7e7563" opacity="0.55" />
    <g stroke="#3c5a45" strokeWidth="1.2" fill="none" strokeLinecap="round">
      <path d="M88 160 C 80 130, 86 110, 72 88" />
      <path d="M84 132 q -10 -4 -14 -12 M82 118 q 9 -3 12 -11 M78 104 q -9 -2 -13 -10 M76 96 q 8 -4 10 -11" />
    </g>
  </svg>
);

type Props = { card: CardConfig; lang: Lang; mini?: boolean };

/** A real button on the card page; a plain span in the gallery preview (no controls there). */
const Btn: React.FC<{ mini: boolean; className: string; onClick?: () => void; children: React.ReactNode; expanded?: boolean; controls?: string }> = ({
  mini,
  className,
  onClick,
  children,
  expanded,
  controls,
}) =>
  mini ? (
    <span className={className}>{children}</span>
  ) : (
    <button type="button" className={className} onClick={onClick} aria-expanded={expanded} aria-controls={controls}>
      {children}
    </button>
  );

/**
 * Six premium demo cards with their own structure, type and material (CSS/SVG only, no pictures):
 * ivory paper, black velvet, clean white, oxblood red, satin graphite and an expressive graphic one.
 * Real functions: the vCard is built from this card's data, sharing uses Web Share or copies the
 * link, and the QR code holds this card's own live URL. E-mail only explains that it is a demo.
 * `mini` renders the same face for the gallery, without controls.
 */
const StyleCard: React.FC<Props> = ({ card, lang, mini = false }) => {
  const s = strings[lang];
  const ids = useId();
  const reduce = useReducedMotion() ?? false;
  const design = card.design as CardDesign;
  const [more, setMore] = useState(false);
  const [status, setStatus] = useState("");
  const url = mini ? "" : styleCardUrl(card.slug, lang);
  const qr = useMemo(() => (url ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg(url))}` : ""), [url]);
  const words = (card.tagline ?? "").split("·").map((w) => w.trim()).filter(Boolean);
  const [first, ...rest] = card.name.split(" ");
  const last = rest.join(" ");

  const copy = async () => {
    const r = await copyText(url);
    setStatus(r === "copied" ? s.copied : s.copyFailed.replace("{url}", url));
  };
  const share = () => {
    // called inside the click, so the share sheet keeps the user activation
    shareLink({ title: card.name, text: `${card.name} – ${card.role ?? ""}`, url }).then((r) => {
      if (r === "shared") setStatus(s.shared);
      else if (r !== "aborted") void copy();
    });
  };

  const save = (
    <Btn mini={mini} className="sc__save" onClick={() => (downloadVCard(card, url), setStatus(s.saved))}>
      <FiUserPlus aria-hidden="true" /> {s.save}
    </Btn>
  );

  const actions =
    design === "white" ? (
      <div className="sc__list">
        <Btn mini={mini} className="sc__row" onClick={() => setStatus(s.emailNote)}>
          <FiMail aria-hidden="true" /> <span>{s.email}</span> <FiChevronRight aria-hidden="true" />
        </Btn>
        <Btn mini={mini} className="sc__row" onClick={share}>
          <FiShare2 aria-hidden="true" /> <span>{s.share}</span> <FiChevronRight aria-hidden="true" />
        </Btn>
        <Btn mini={mini} className="sc__row" onClick={() => setMore((v) => !v)} expanded={more} controls={`${ids}-more`}>
          <FiMoreHorizontal aria-hidden="true" /> <span>{s.more}</span> <FiChevronRight aria-hidden="true" />
        </Btn>
      </div>
    ) : (
      <div className="sc__icons">
        <Btn mini={mini} className="sc__icon" onClick={() => setStatus(s.emailNote)}>
          <span className="sc__circle" aria-hidden="true">
            <FiMail />
          </span>
          {s.email}
        </Btn>
        <Btn mini={mini} className="sc__icon" onClick={share}>
          <span className="sc__circle" aria-hidden="true">
            <FiShare2 />
          </span>
          {s.share}
        </Btn>
        <Btn mini={mini} className="sc__icon" onClick={() => setMore((v) => !v)} expanded={more} controls={`${ids}-more`}>
          <span className="sc__circle" aria-hidden="true">
            <FiMoreHorizontal />
          </span>
          {s.more}
        </Btn>
      </div>
    );

  // The name: the page heading on the card page, plain text in the gallery.
  const H = (mini ? "div" : "h1") as "h1";
  const name =
    design === "velvet" || design === "graphite" ? (
      <H className="sc__name" data-focus={mini ? undefined : ""}>
        <span>{first}</span> <span>{last}</span>
      </H>
    ) : (
      <H className="sc__name" data-focus={mini ? undefined : ""}>
        {[first, last].map((part, i) => (
          <motion.span
            key={part}
            initial={reduce || mini || design !== "oxblood" ? false : { y: "0.35em", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.22, 0.75, 0.18, 1] }}
          >
            {part}
            {i === 0 ? " " : ""}
          </motion.span>
        ))}
      </H>
    );

  return (
    <div className={`sc-wrap${mini ? " sc-wrap--mini" : ""}`}>
      <article className={`sc sc--${design}`} aria-hidden={mini || undefined} aria-label={mini ? undefined : `${card.name}, ${card.role ?? ""}`}>
        <span className="sc__grain" aria-hidden="true" />
        {design === "expressive" && (
          <>
            <span className="sc__shape sc__shape--a" aria-hidden="true" />
            <span className="sc__shape sc__shape--b" aria-hidden="true" />
          </>
        )}
        <header className="sc__top">
          <span className="sc__initials" aria-hidden="true">
            {initials(card.name)}
          </span>
          {!mini && <LangSwitch className="sc__lang" />}
        </header>

        <div className="sc__body">
          {name}
          <p className="sc__role">{card.role}</p>
          {design === "ivory" && <Arch />}
          <span className="sc__rule" aria-hidden="true" />
          <p className="sc__words">
            {words.map((w, i) => (
              <span key={w}>
                {w}
                {design === "graphite" && i === 0 && <em aria-hidden="true">{"//"}</em>}
              </span>
            ))}
          </p>
        </div>

        <div className="sc__actions" role={mini ? undefined : "group"} aria-label={mini ? undefined : s.actions}>
          {save}
          {actions}
        </div>
      </article>

      {!mini && (
        <>
          <p className="sc__status" role="status">
            {status}
          </p>
          <section id={`${ids}-more`} className={`sc-more sc-more--${design}`} hidden={!more} aria-labelledby={`${ids}-mt`}>
            <div className="sc-more__head">
              <h2 id={`${ids}-mt`}>{s.moreTitle.replace("{name}", first)}</h2>
              <button type="button" onClick={() => setMore(false)} aria-label={s.less}>
                <FiX aria-hidden="true" />
              </button>
            </div>
            <dl>
              {(card.details ?? []).map((d) => (
                <div key={d.label}>
                  <dt>{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
              {card.email && (
                <div>
                  <dt>{s.email}</dt>
                  <dd>{card.email}</dd>
                </div>
              )}
              {card.website && (
                <div>
                  <dt>{s.website}</dt>
                  <dd>{card.website.label}</dd>
                </div>
              )}
            </dl>
            <figure className="sc-more__qr">
              <img src={qr} alt={`${s.qr}: ${url}`} width={132} height={132} />
              <figcaption>{s.qr}</figcaption>
            </figure>
            <button type="button" className="sc-more__copy" onClick={copy}>
              <FiCopy aria-hidden="true" /> {s.copy}
            </button>
            <p className="sc-more__demo">{s.demo}</p>
          </section>
        </>
      )}
    </div>
  );
};

export default StyleCard;
