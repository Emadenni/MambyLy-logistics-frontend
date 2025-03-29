import React from "react";
import { Button } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import "./logoutButton.scss"

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("adminId");
setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <Button onClick={handleLogout} variant="contained" color="primary" className="logout_button"  sx={{
      padding: "4px", 
      fontSize: 20,
      marginLeft: 30,
      
    }}>
         <ExitToAppIcon sx={{ fontSize: 20  }}  />
    </Button>
  );
};

export default LogoutButton;
