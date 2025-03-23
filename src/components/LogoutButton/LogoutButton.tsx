import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

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
    <Button onClick={handleLogout} variant="contained" color="primary">
      Logout
    </Button>
  );
};

export default LogoutButton;
