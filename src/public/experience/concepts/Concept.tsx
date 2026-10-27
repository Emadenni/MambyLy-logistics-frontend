import React from "react";
import { useParams } from "react-router-dom";
import { useCopy } from "../i18n";
import { ScreenHead } from "../Screen";
import { CONCEPTS, CONCEPT_BASE, conceptOfSlug, type ConceptId, type Lang } from "../routes";
import { NotFound } from "../screens/Privacy";
import { conceptCopy } from "./content";
import Editorial from "./Editorial";
import Typographic from "./Typographic";
import Minimal from "./Minimal";
import Visual from "./Visual";
import Interactive from "./Interactive";

const pathsOf = (id: ConceptId): Record<Lang, string> => {
  const slug = CONCEPTS.find((c) => c.id === id)!.slug;
  return { sv: `${CONCEPT_BASE.sv}/${slug.sv}`, en: `${CONCEPT_BASE.en}/${slug.en}` };
};

/** /webbplatser/koncept/:slug (English /en/websites/concepts/:slug): one fullscreen design concept. */
const Concept: React.FC = () => {
  const t = useCopy();
  const { slug } = useParams();
  const id = conceptOfSlug(slug, t.lang);
  if (!id) return <NotFound />;
  const all = conceptCopy[t.lang];
  const s = all.shared;
  const head = (
    <ScreenHead
      lang={t.lang}
      title={all[id].meta}
      description={`${s.concept} · ${s.fictitious}. ${s.footer}`}
      paths={pathsOf(id)}
      noindex
    />
  );
  return (
    <>
      {head}
      {id === "editorial" && <Editorial c={all.editorial} s={s} />}
      {id === "typographic" && <Typographic c={all.typographic} s={s} />}
      {id === "minimal" && <Minimal c={all.minimal} s={s} />}
      {id === "visual" && <Visual c={all.visual} s={s} />}
      {id === "interactive" && <Interactive c={all.interactive} s={s} />}
    </>
  );
};

export default Concept;
