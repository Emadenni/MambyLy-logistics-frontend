import React from "react";
import "./adminPage.scss";
import AdminPageTabs from "../../components/AdminPageTabs/AdminPageTabs";
import AdminInfoBox from "../../components/AdminInfoBox/AdminInfoBox";
import { fakeAdmins } from "../../fakeData/fakeAdmins";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import Logo from "../../components/Logo/Logo";
const AdminPage: React.FC = () => {
  const adminLoggedIn = fakeAdmins[0];

  return (
    <div>
      <div className="admin_container">
        <div className="admin_info">
          <AdminInfoBox admin={adminLoggedIn} />
        </div>
        <div className="logout_button">
          <LogoutButton />
        </div>
      </div>
      <AdminPageTabs />
      <div className="logo_container" >
     <Logo size="small" />
     </div>
    </div>
    
  );
};

export default AdminPage;
