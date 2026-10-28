import React from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useCopy } from "../i18n";
import { ScreenHead } from "../Screen";
import { CONCEPTS, CONCEPT_BASE, PATHS, RETIRED_CONCEPTS, conceptOfSlug, conceptPath, type ConceptId, type Lang } from "../routes";
import { NotFound } from "../screens/Privacy";
import { conceptCopy } from "./content";
import Restaurant from "./Restaurant";
import Photographer from "./Photographer";
import Logistics from "./Logistics";
import Painter from "./Painter";
import Architecture from "./Architecture";
import Lighting from "./Lighting";
import Typographic from "./Typographic";

const pathsOf = (id: ConceptId): Record<Lang, string> => {
  const slug = CONCEPTS.find((c) => c.id === id)!.slug;
  return { sv: `${CONCEPT_BASE.sv}/${slug.sv}`, en: `${CONCEPT_BASE.en}/${slug.en}` };
};

/** /webbplatser/koncept/:slug (English /en/websites/concepts/:slug): one fullscreen website demo. */
const Concept: React.FC = () => {
  const t = useCopy();
  const { slug } = useParams();
  const location = useLocation();
  const id = conceptOfSlug(slug, t.lang);
  if (!id) {
    // Earlier gallery: the kept demos moved to new addresses, the others lead to the gallery.
    const key = slug?.toLowerCase() ?? "";
    if (key in RETIRED_CONCEPTS) {
      const moved = RETIRED_CONCEPTS[key];
      return <Navigate to={moved ? conceptPath(moved, t.lang) : PATHS.websites[t.lang]} replace state={location.state} />;
    }
    return <NotFound />;
  }
  const s = conceptCopy[t.lang].shared;
  return (
    <>
      <ScreenHead lang={t.lang} title={conceptCopy[t.lang][id].meta} description={`${s.concept} · ${s.fictitious}. ${s.footer}`} paths={pathsOf(id)} noindex />
      {id === "restaurant" && <Restaurant />}
      {id === "photographer" && <Photographer />}
      {id === "logistics" && <Logistics />}
      {id === "painter" && <Painter />}
      {id === "architecture" && <Architecture c={conceptCopy[t.lang].architecture} s={s} />}
      {id === "lighting" && <Lighting c={conceptCopy[t.lang].lighting} />}
      {id === "typographic" && <Typographic c={conceptCopy[t.lang].typographic} />}
    </>
  );
};

export default Concept;
