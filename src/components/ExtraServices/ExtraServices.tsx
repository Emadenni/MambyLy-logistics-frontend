import React from "react";
import { Link } from "react-router-dom";
import { FiBookOpen, FiShoppingBag } from "react-icons/fi";
import "./extraServices.scss";
import CTA from "../Cta/Cta";

const ExtraServices = () => {
  return (
    <div className="extra-services">
      <h1 className="extra-services-title">Extra Tjänster</h1>

      <div className="cards-container">
        <div className="card shopify">
          <div className="icon-wrapper">
            <FiShoppingBag size={40} />
          </div>
          <h2>Bygga din butik med Shopify? Inga problem.</h2>
          <p>
            Vill du inte ha en helt skräddarsydd butik? Då kan vi hjälpa dig att komma igång med Shopify. Vi hjälper dig
            att sätta upp och anpassa din butik så att du kan börja sälja snabbt och smidigt.
          </p>
          <Link to="/kontaktaOss">
            <CTA
              className="cta_button"
              text="Kontakta Oss"
              backgroundColor="pink"
              color="black"
             hoverBackgroundColor="white"
              hoverColor="darkgreen"
            />
          </Link>
          <span className="note">Vi är inte officiellt anslutna till Shopify.</span>
        </div>

        <div className="card kdp">
          <div className="icon-wrapper">
            <FiBookOpen size={40} />
          </div>
          <h2>Gör din bokidé till verklighet med KDP.</h2>
          <p>
            Vill du publicera en bok men stöter på tekniska hinder? Vi hjälper dig att ta dig igenom processen med
            Kindle Direct Publishing – enkelt, prisvärt och utan huvudvärk.
          </p>
          <Link to="/kontaktaOss">
            <CTA
              className="cta_button"
              text="Kontakta Oss"
              backgroundColor="orange"
              color="white"
              hoverBackgroundColor="white"
              hoverColor="darkgreen"
            />
          </Link>
          <span className="note">Vi är inte officiellt anslutna till Amazon eller Kindle Direct Publishing.</span>
        </div>
      </div>
    </div>
  );
};

export default ExtraServices;
