import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { phoneLang, TOOL_LANGS } from "../shared/engine";
import { loadPlace, type Loaded } from "./data";
import GuideView from "./GuideView";
import { GUIDE_UI } from "./strings";

/** Loads one place and shows its start or one of its points; a plain message when the link is wrong. */
const PlaceLoader: React.FC<{ slug?: string; pointId?: string; base: string }> = ({ slug, pointId, base }) => {
  const [state, setState] = useState<Loaded | null>(null);
  useEffect(() => {
    let live = true;
    setState(null);
    void loadPlace(slug).then((r) => live && setState(r));
    return () => {
      live = false;
    };
  }, [slug]);

  if (state?.state === "ok") return <GuideView place={state.place} pointId={pointId} base={base} />;
  const u = GUIDE_UI[phoneLang(TOOL_LANGS)];
  return (
    <div className="gd gd-status">
      <Helmet>
        <title>MambyLy Guide</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {state === null ? (
        <p className="gd-status__wait" role="status">
          <i aria-hidden="true" />
          <span>{u.loading}</span>
        </p>
      ) : (
        <div className="gd-status__box" role="alert">
          <h1>{state.state === "missing" ? u.missingTitle : "MambyLy Guide"}</h1>
          <p>{state.state === "missing" ? u.missingText : u.errorText}</p>
        </div>
      )}
    </div>
  );
};

/** /guide/<place> and /guide/<place>/<point>: the page a visitor opens from the NFC tag or QR code at a point. */
export const GuidePlacePage: React.FC = () => {
  const { place, point } = useParams();
  const slug = place?.toLowerCase();
  return <PlaceLoader slug={slug} pointId={point?.toLowerCase()} base={`/guide/${slug}`} />;
};

/** /tools/guide/demo/<place>[/<point>]: the public demo (a made-up place). */
export const GuideDemoPage: React.FC = () => {
  const { place, point } = useParams();
  const slug = place?.toLowerCase();
  return <PlaceLoader slug={slug} pointId={point?.toLowerCase()} base={`/tools/guide/demo/${slug}`} />;
};
