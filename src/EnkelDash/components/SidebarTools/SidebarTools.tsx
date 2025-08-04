import React, { useEffect, useState } from "react";
import "./SidebarTools.scss";
import catchyIcon from "../../assets/catchy.webp";
import doolioIcon from "../../assets/doolio.webp";
import mailManagerIcon from "../../assets/mailManager.webp";
import { AiOutlineRobot } from "react-icons/ai";

const CatchyPreview: React.FC = () => (
  <>
    <div className="tool-header">
      <img src={catchyIcon} alt="Catchy" />
    </div>
    <div className="tool-preview">
      <p className="quote">“Din perfekta fras – ett klick bort.”</p>
      <button className="tool-button">Öppna Catchy</button>
    </div>
  </>
);

const DoolioPreview: React.FC = () => (
  <>
    <div className="tool-header">
      <img src={doolioIcon} alt="Doolio" />
    </div>
    <div className="tool-preview doolio-preview">
      <div className="doolio-card">
        <p className="title">Brief: Sommarkampanj</p>
        <p className="desc">Genererad copy · CTA: ”Upptäck nu”</p>
      </div>
      <button className="tool-button">Öppna Doolio</button>
    </div>
  </>
);

const MailManagerPreview: React.FC = () => (
  <>
    <div className="tool-header">
      <img src={mailManagerIcon} alt="Mail Manager" />
    </div>
    <div className="tool-preview">
      <button className="tool-button">Öppna Mail Manager</button>
    </div>
  </>
);

const AISupportPreview: React.FC = () => (
  <div className="tool-block ai-support">
    <div className="tool-header">
      <AiOutlineRobot />
    </div>
    <div className="tool-preview ai-support-preview">
      <textarea placeholder="Chiedi all’AI di aiutarti…" />
      <button className="tool-button">Invia</button>
    </div>
  </div>
);

type ToolKey = "catchy" | "doolio" | "mail" | "ai";
const renderTool = (tool: ToolKey | null) => {
  if (!tool) return null;
  switch (tool) {
    case "catchy":
      return <CatchyPreview />;
    case "doolio":
      return <DoolioPreview />;
    case "mail":
      return <MailManagerPreview />;
    case "ai":
      return <AISupportPreview />;
    default:
      return null;
  }
};

const SidebarTools: React.FC = () => {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [desktopActive, setDesktopActive] = useState<ToolKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileActive, setMobileActive] = useState<ToolKey | null>(null);

  useEffect(() => {
    const setVH = () => {
      const vh = (window.visualViewport?.height ?? window.innerHeight) / 100;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    const onResize = () => setVH();
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  const openDesktop = (tool: ToolKey) => {
    setDesktopActive(tool);
    setDesktopOpen(true);
  };
  const closeDesktop = () => {
    setDesktopOpen(false);
    setDesktopActive(null);
  };

  const openMobile = (tool: ToolKey) => {
    setMobileActive(tool);
    setMobileOpen(true);
  };
  const closeMobile = () => {
    setMobileOpen(false);
    setMobileActive(null);
  };

  return (
    <aside className="sidebar-tools">
      <div className="sidebar-desktop is-tabs-enabled">
        <div className="tool-block catchy">
          <CatchyPreview />
        </div>
        <div className="tool-block doolio">
          <DoolioPreview />
        </div>
        <div className="tool-block mailmanager">
          <MailManagerPreview />
        </div>
        <AISupportPreview />
      </div>

      <div className="desktop-tabs desktop-only">
        <button
          className={`desktop-tab ${desktopActive === "catchy" && desktopOpen ? "active" : ""}`}
          onClick={() => openDesktop("catchy")}
          aria-label="Apri Catchy"
        >
          <img src={catchyIcon} alt="Catchy" />
        </button>
        <button
          className={`desktop-tab ${desktopActive === "doolio" && desktopOpen ? "active" : ""}`}
          onClick={() => openDesktop("doolio")}
          aria-label="Apri Doolio"
        >
          <img src={doolioIcon} alt="Doolio" />
        </button>
        <button
          className={`desktop-tab ${desktopActive === "mail" && desktopOpen ? "active" : ""}`}
          onClick={() => openDesktop("mail")}
          aria-label="Apri Mail Manager"
        >
          <img src={mailManagerIcon} alt="Mail Manager" />
        </button>
        <button
          className={`desktop-tab ${desktopActive === "ai" && desktopOpen ? "active" : ""}`}
          onClick={() => openDesktop("ai")}
          aria-label="Apri AI Support"
        >
          <AiOutlineRobot />
        </button>
      </div>

      <div className={`desktop-panel ${desktopOpen ? "open" : ""} desktop-only`} role="dialog" aria-modal="true">
        <div className="desktop-panel__inner">
          <div className="panel-header">
            {desktopActive === "catchy" && <h3>Catchy</h3>}
            {desktopActive === "doolio" && <h3>Doolio</h3>}
            {desktopActive === "mail" && <h3>Mail Manager</h3>}
            {desktopActive === "ai" && <h3>AI Support</h3>}
            <button className="panel-close" onClick={closeDesktop} aria-label="Chiudi">×</button>
          </div>
          <div className="panel-body">{renderTool(desktopActive)}</div>
        </div>
      </div>

      <div className="sidebar-mobile">
        <div className="mobile-tabs-wrap">
          <div className="mobile-tabs">
            <button
              className={`mobile-tab ${mobileActive === "catchy" && mobileOpen ? "active" : ""}`}
              onClick={() => openMobile("catchy")}
              aria-label="Apri Catchy"
            >
              <img src={catchyIcon} alt="Catchy" />
            </button>
            <button
              className={`mobile-tab ${mobileActive === "doolio" && mobileOpen ? "active" : ""}`}
              onClick={() => openMobile("doolio")}
              aria-label="Apri Doolio"
            >
              <img src={doolioIcon} alt="Doolio" />
            </button>
            <button
              className={`mobile-tab ${mobileActive === "mail" && mobileOpen ? "active" : ""}`}
              onClick={() => openMobile("mail")}
              aria-label="Apri Mail Manager"
            >
              <img src={mailManagerIcon} alt="Mail Manager" />
            </button>
            <button
              className={`mobile-tab ${mobileActive === "ai" && mobileOpen ? "active" : ""}`}
              onClick={() => openMobile("ai")}
              aria-label="Apri AI Support"
            >
              <AiOutlineRobot />
            </button>
          </div>
        </div>

        <div className={`mobile-panel ${mobileOpen ? "open" : ""}`} role="dialog" aria-modal="true">
          <div className="mobile-panel__inner">
            <div className="panel-header">
              {mobileActive === "catchy" && <h3>Catchy</h3>}
              {mobileActive === "doolio" && <h3>Doolio</h3>}
              {mobileActive === "mail" && <h3>Mail Manager</h3>}
              {mobileActive === "ai" && <h3>AI Support</h3>}
              <button className="panel-close" onClick={closeMobile} aria-label="Chiudi">×</button>
            </div>
            <div className="panel-body">{renderTool(mobileActive)}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarTools;
