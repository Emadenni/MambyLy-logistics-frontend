import React from "react";
import { Link } from "react-router-dom";
import "./admin_link.scss";
import admin_link_icon from "../../assets/images/admin_link_icon.png";

const Admin_link = (props: Props) => {
  return (
    <div className="admin_link_container">
      <Link to="/admin">
        <img src={admin_link_icon} alt="admin_link_icon" className="admin_link_icon" />
      </Link>
    </div>
  );
};

export default Admin_link;
