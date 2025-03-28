import React, { useState } from "react";
import { TextField, Button, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./loginForm.scss";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [logoutMessage, setLogoutMessage] = useState(
    sessionStorage.getItem("logoutMessage") || ""
  );

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

  // Rimuoviamo il messaggio dopo averlo mostrato
  React.useEffect(() => {
    if (logoutMessage) {
      sessionStorage.removeItem("logoutMessage");
    }
  }, [logoutMessage]);

  return (
    <div className="login_overlay">
      <div className="login_overlay__container">
        <button className="login_overlay__close-btn" onClick={handleClose}>
          X
        </button>
        <Typography variant="h5" className="login_overlay__form-title">
          Login
        </Typography>
        <Typography variant="h6" className="login_overlay__form-subtitle">
          Admins Only
        </Typography>
        {logoutMessage && (
          <Typography color="error">{logoutMessage}</Typography>
        )}
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
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          {passwordError && <Typography color="error">{passwordError}</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          {successMessage && (
            <Typography color="primary">{successMessage}</Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
