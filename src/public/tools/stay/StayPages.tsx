import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useSearchParams } from "react-router-dom";
import { DEMOS, loadHouse, phoneLang, type DemoId, type Loaded } from "./data";
import Guest from "./Guest";
import { STAY_UI } from "./strings";
import { STAY_LANGS } from "./types";
import "../../styles/stay.scss";

/** Loads one house and shows its guest page, or a plain message when the link is wrong. */
const HouseLoader: React.FC<{ slug?: string; keyCode?: string | null }> = ({ slug, keyCode }) => {
  const [state, setState] = useState<Loaded | null>(null);
  useEffect(() => {
    let live = true;
    setState(null);
    void loadHouse(slug, keyCode).then((r) => live && setState(r));
    return () => {
      live = false;
    };
  }, [slug, keyCode]);

  if (state?.state === "ok") return <Guest house={state.house} />;
  const u = STAY_UI[phoneLang(STAY_LANGS)];
  return (
    <div className="sg sg--stuga sg-status">
      <Helmet>
        <title>MambyLy Stay</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {state === null ? (
        <p className="sg-status__wait" role="status">
          <i aria-hidden="true" />
          <span>{u.loading}</span>
        </p>
      ) : (
        <div className="sg-status__box" role="alert">
          <h1>{state.state === "missing" ? u.missingTitle : "MambyLy Stay"}</h1>
          <p>{state.state === "missing" ? u.missingText : u.errorText}</p>
        </div>
      )}
    </div>
  );
};

/** /stay/<house>?k=<key>: the page a guest opens from the NFC tag or the QR code in the house. */
export const StayHousePage: React.FC = () => {
  const { slug } = useParams();
  const [search] = useSearchParams();
  return <HouseLoader slug={slug?.toLowerCase()} keyCode={search.get("k")} />;
};

/** /tools/stay/demo/stuga and /tools/stay/demo/lagenhet: the public demos (made-up houses). */
export const StayDemoPage: React.FC = () => {
  const { demo } = useParams();
  const d = DEMOS[demo as DemoId];
  return <HouseLoader slug={d?.slug} keyCode={d?.key} />;
};
