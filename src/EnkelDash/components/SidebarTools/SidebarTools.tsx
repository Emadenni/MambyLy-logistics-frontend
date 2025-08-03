import React, { useState } from "react";
import "./SidebarTools.scss";

import catchyIcon from "../../assets/catchy.webp";
import doolioIcon from "../../assets/doolio.webp";
import mailManagerIcon from "../../assets/mailManager.webp";

import PsychologyIcon from "@mui/icons-material/Psychology"; // icona MUI per AI Support

type ToolId = "catchy" | "doolio" | "mailmanager" | "aisupport";

const SidebarTools: React.FC = () => {
  const [openMobileTool, setOpenMobileTool] = useState<ToolId | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");

  const toggleMobileTool = (id: ToolId) => {
    setOpenMobileTool((curr) => (curr === id ? null : id));
  };

  const handleAiSubmit = () => {
    console.log("AI Prompt inviato:", aiPrompt);
    setAiPrompt("");
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

        {/* AI Support */}
        <div className="tool-block ai-support">
          <div className="tool-header">
            <PsychologyIcon style={{ fontSize: 48, color: "white" }} />
          </div>
          <div className="tool-preview ai-support-preview">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Skriv din fråga..."
            />
            <button className="tool-button" onClick={handleAiSubmit}>
              Skicka
            </button>
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

          {/* Tab AI Support */}
          <button
            type="button"
            className={`mobile-tab ${openMobileTool === "aisupport" ? "active" : ""}`}
            aria-label="AI Support"
            onClick={() => toggleMobileTool("aisupport")}
          >
            <PsychologyIcon style={{ fontSize: 30, color: "#25335e" }} />
          </button>
        </div>

        <div className={`mobile-panel ${openMobileTool ? "open" : ""}`}>
          <div className="mobile-panel__inner">
            {openMobileTool === "aisupport" && (
              <div className="panel-content">
                <div className="panel-header">
                  <PsychologyIcon style={{ fontSize: 28, color: "#25335e" }} />
                  <h3>AI Support</h3>
                  <button className="panel-close" onClick={() => setOpenMobileTool(null)}>
                    ×
                  </button>
                </div>
                <div className="panel-body ai-support-preview">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Skriv din fråga..."
                  />
                  <button className="tool-button" onClick={handleAiSubmit}>
                    Skicka
                  </button>
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
