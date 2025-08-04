import React from "react";
import TopBar from "../../components/TopBar/TopBar";
import SidebarTools from "../../components/SidebarTools/SidebarTools";
import TeamWall from "../../components/TeamWall/TeamWall";
import "./Dashboard.scss";

const Dashboard: React.FC = () => {
  return (
    <>
      <TopBar />
      <div className="dashboard-layout">
        <main className="dashboard-content">
          <TeamWall />
        </main>
        <aside className="dashboard-sidebar">
          <SidebarTools />
        </aside>
      </div>
    </>
  );
};

export default Dashboard;
