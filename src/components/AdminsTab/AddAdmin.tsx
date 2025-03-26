import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useRegisterAdmin from "../../hooks/useRegisterAdmin";
import { AddAdminProps } from "../../types/common";

const AddAdmin: React.FC<AddAdminProps> = ({ open, onClose, onAddAdmin }) => {
  const { newAdmin, error, handleChange, handleFileChange, submitAdmin, setNewAdmin, fieldErrors } = useRegisterAdmin();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleAddNewAdmin = async (): Promise<void> => {
    const result: { success: boolean; message?: string } = await submitAdmin();

    if (result.success) {
      setSuccessMessage("Admin added successfully!");

      setNewAdmin({
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        profileImage: "",
      });

      onAddAdmin();

      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 3000);
    } else {
      setSuccessMessage(null);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Admin</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <TextField
          label="First Name"
          fullWidth
          value={newAdmin.firstName}
          onChange={(e) => handleChange(e, "firstName")}
          sx={{ marginBottom: 2 }}
          error={Boolean(fieldErrors.firstName)}
          helperText={fieldErrors.firstName}
        />
        <TextField
          label="Last Name"
          fullWidth
          value={newAdmin.lastName}
          onChange={(e) => handleChange(e, "lastName")}
          sx={{ marginBottom: 2 }}
          error={Boolean(fieldErrors.lastName)}
          helperText={fieldErrors.lastName}
        />
        <TextField
          label="Email"
          fullWidth
          value={newAdmin.email}
          onChange={(e) => handleChange(e, "email")}
          sx={{ marginBottom: 2 }}
          error={Boolean(fieldErrors.email)}
          helperText={fieldErrors.email}
        />
        <TextField
          label="Password"
          fullWidth
          value={newAdmin.password}
          onChange={(e) => handleChange(e, "password")}
          sx={{ marginBottom: 2 }}
          error={Boolean(fieldErrors.password)}
          helperText={fieldErrors.password}
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <input accept="image/*" id="profile-image" type="file" hidden onChange={handleFileChange} />
        <label htmlFor="profile-image">
          <Button variant="contained" component="span" sx={{ marginBottom: 2 }}>
            Upload Profile Image
          </Button>
        </label>

        {newAdmin.profileImage && (
          <div>
            <img
              src={newAdmin.profileImage}
              alt="Profile Preview"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                marginTop: "10px",
              }}
            />
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddNewAdmin} color="primary" variant="contained">
          Add Admin
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAdmin;
