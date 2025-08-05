import React, { useEffect, useMemo, useState } from "react";
import TopBar from "../../components/TopBar/TopBar";
import SidebarTools from "../../components/SidebarTools/SidebarTools";
import TeamWall from "../../components/TeamWall/TeamWall";
import Summary from "../../components/Summary/Summary";
import { useSidebarStore } from "../../store/SidebarStore";
import "./Dashboard.scss";

type ViewKey = "summary" | "bacheca";
const VIEW_KEY = "dash:view";

const Dashboard: React.FC = () => {
  const [view, setView] = useState<ViewKey>(() => {
    const saved = (localStorage.getItem(VIEW_KEY) as ViewKey) || "summary";
    return saved || "summary";
  });

  const { isOpen: isSidebarOpen, toggleSidebar } = useSidebarStore();

  useEffect(() => {
    localStorage.setItem(VIEW_KEY, view);
  }, [view]);

  // Hotkeys: S -> Summary, B -> Bacheca
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName?.match(/input|textarea|select/i)) return;
      if (e.key.toLowerCase() === "s") setView("summary");
      if (e.key.toLowerCase() === "b") setView("bacheca");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ActiveMain = useMemo(() => {
    if (view === "summary") return <Summary />;
    return <TeamWall />;
  }, [view]);

  return (
    <>
      <TopBar />

      {/* Switch tabs */}
      <div className="dash-switch">
        <div className="dash-tabs" role="tablist" aria-label="Dashboard views">
          <button
            role="tab"
            aria-selected={view === "summary"}
            className={`dash-tab ${view === "summary" ? "active" : ""}`}
            onClick={() => setView("summary")}
          >
            Summary
          </button>
          <button
            role="tab"
            aria-selected={view === "bacheca"}
            className={`dash-tab ${view === "bacheca" ? "active" : ""}`}
            onClick={() => setView("bacheca")}
          >
            TeamWall
          </button>
        </div>
      </div>

      <div className={`dashboard-layout ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <main className={`dashboard-content view-${view}`}>{ActiveMain}</main>

        <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
          <button className="sidebar-close-btn" onClick={toggleSidebar}>
            ×
          </button>
          <SidebarTools />
        </aside>
      </div>
    </>
  );
};

export default Dashboard;
