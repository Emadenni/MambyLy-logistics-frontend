import React from "react";
import TopBar from "../../components/TopBar/TopBar";
import SidebarTools from "../../components/SidebarTools/SidebarTools";

const Dashboard = () => {
  return (
    <>
      <TopBar />
      <div className="dashboard-layout">
        <div className="dashboard-content">
          {/* Contenuto del pannello principale */}
        </div>
        <SidebarTools />
      </div>
    </>
  );
};

export default Dashboard;
