import React from "react";
import { Link } from "react-router-dom";
import "./adminLink.scss";
import admin_link_icon from "../../assets/images/admin_link_icon.png";

const AdminLink: React.FC = () => {
  return (
    <div className="admin_link_container">
      <Link to="/admin">
        <img src={admin_link_icon} alt="admin_link_icon" className="admin_link_icon" />
      </Link>
    </div>
  );
};

export default AdminLink;
