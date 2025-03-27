import React from "react";
import "./adminPage.scss";
import AdminPageTabs from "../../components/AdminPageTabs/AdminPageTabs";
import AdminInfoBox from "../../components/AdminsTab/AdminInfoBox";
import Logo from "../../components/Logo/Logo";
const AdminPage: React.FC = () => {


  return (
    <div>
      <div className="admin_container">
        <div className="admin_info">
          <AdminInfoBox />
        </div>
        <div className="logout_button"></div>
      </div>
      <AdminPageTabs />
      <div className="admin_logo_container">
        <Logo size="small" />
      </div>
    </div>
  );
};

export default AdminPage;
