import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import useLogin from "../../hooks/useLogin";
import "./loginForm.scss"; 

const LoginForm = () => {
  const [showForm, setShowForm] = useState(true); 
  const navigate = useNavigate();

  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    successMessage,
    handleSubmit,
    isLoading,
  } = useLogin();

  const handleClose = () => {
    setShowForm(false); 
    navigate("/");
  };

  if (!showForm) return null; 

  return (
    <div className="login_overlay">
      <div className="login_overlay__container">
        <button className="login_overlay__close-btn" onClick={handleClose}>X</button>
        <Typography variant="h5" className="login_overlay__form-title">Login</Typography>
        <Typography variant="h6" className="login_overlay__form-subtitle">Admin Only</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          {successMessage && <Typography color="primary">{successMessage}</Typography>}
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            color="primary" 
            sx={{ marginTop: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;