import React, { useState } from "react";
import "./SidebarTools.scss";

import catchyIcon from "../../assets/catchy.webp";
import doolioIcon from "../../assets/doolio.webp";
import mailManagerIcon from "../../assets/mailManager.webp";

type ToolId = "catchy" | "doolio" | "mailmanager";

const SidebarTools: React.FC = () => {
  const [openMobileTool, setOpenMobileTool] = useState<ToolId | null>(null);

  const toggleMobileTool = (id: ToolId) => {
    setOpenMobileTool((curr) => (curr === id ? null : id));
  };

  return (
    <aside className="sidebar-tools">
      <div className="sidebar-desktop">
        <div className="tool-block catchy">
          <div className="tool-header">
            <img src={catchyIcon} alt="Catchy" />
          </div>
          <div className="tool-preview">
            <p className="quote">“Din perfekta fras – ett klick bort.”</p>
            <button className="tool-button">Öppna Catchy</button>
          </div>
        </div>

        <div className="tool-block doolio">
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
        </div>

        <div className="tool-block mailmanager">
          <div className="tool-header">
            <img src={mailManagerIcon} alt="Mail Manager" />
          </div>
          <div className="tool-preview">
            <button className="tool-button">Öppna Mail Manager</button>
          </div>
        </div>
      </div>

      <div className="sidebar-mobile">
        <div className="mobile-tabs" aria-label="Tool tabs">
          <button
            type="button"
            className={`mobile-tab ${openMobileTool === "catchy" ? "active" : ""}`}
            aria-label="Catchy"
            onClick={() => toggleMobileTool("catchy")}
          >
            <img src={catchyIcon} alt="" />
          </button>

          <button
            type="button"
            className={`mobile-tab ${openMobileTool === "doolio" ? "active" : ""}`}
            aria-label="Doolio"
            onClick={() => toggleMobileTool("doolio")}
          >
            <img src={doolioIcon} alt="" />
          </button>

          <button
            type="button"
            className={`mobile-tab ${openMobileTool === "mailmanager" ? "active" : ""}`}
            aria-label="Mail Manager"
            onClick={() => toggleMobileTool("mailmanager")}
          >
            <img src={mailManagerIcon} alt="" />
          </button>
        </div>

        <div className={`mobile-panel ${openMobileTool ? "open" : ""}`} role="region" aria-live="polite">
          <div className="mobile-panel__inner">
            {openMobileTool === "catchy" && (
              <div className="panel-content">
                <div className="panel-header">
                  <img src={catchyIcon} alt="Catchy" />
                  <h3>Catchy</h3>
                  <button className="panel-close" aria-label="Close" onClick={() => setOpenMobileTool(null)}>
                    ×
                  </button>
                </div>
                <div className="panel-body">
                  <p className="quote">“Din perfekta fras – ett klick bort.”</p>
                  <button className="tool-button">Öppna Catchy</button>
                </div>
              </div>
            )}

            {openMobileTool === "doolio" && (
              <div className="panel-content">
                <div className="panel-header">
                  <img src={doolioIcon} alt="Doolio" />
                  <h3>Doolio</h3>
                  <button className="panel-close" aria-label="Close" onClick={() => setOpenMobileTool(null)}>
                    ×
                  </button>
                </div>
                <div className="panel-body">
                  <div className="doolio-card">
                    <p className="title">Brief: Sommarkampanj</p>
                    <p className="desc">Genererad copy · CTA: ”Upptäck nu”</p>
                  </div>
                  <button className="tool-button">Öppna Doolio</button>
                </div>
              </div>
            )}

            {openMobileTool === "mailmanager" && (
              <div className="panel-content">
                <div className="panel-header">
                  <img src={mailManagerIcon} alt="Mail Manager" />
                  <h3>Mail Manager</h3>
                  <button className="panel-close" aria-label="Close" onClick={() => setOpenMobileTool(null)}>
                    ×
                  </button>
                </div>
                <div className="panel-body">
                  <button className="tool-button">Öppna Mail Manager</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarTools;
