import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import "./loginForm.scss"; 

const LoginForm = () => {
  const [showForm, setShowForm] = useState(true); 
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(""); 
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

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Le password non coincidono");
      return;
    }
    setPasswordError("");
    handleSubmit(e); 
  };

  if (!showForm) return null; 

  return (
    <div className="login_overlay">
      <div className="login_overlay__container">
        <button className="login_overlay__close-btn" onClick={handleClose}>X</button>
        <Typography variant="h5" className="login_overlay__form-title">Login</Typography>
        <Typography variant="h6" className="login_overlay__form-subtitle">Admins Only</Typography>
        <form onSubmit={handleLocalSubmit}>
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
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {passwordError && <Typography color="error">{passwordError}</Typography>}
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
