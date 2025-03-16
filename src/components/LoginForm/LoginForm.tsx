import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import "./loginForm.scss"; 

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(true); 
  const navigate = useNavigate();
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("https://reqres.in/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();

      if (data.token) {
        sessionStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        setError("");
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

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
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
