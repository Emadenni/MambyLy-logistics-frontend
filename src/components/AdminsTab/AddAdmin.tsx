import React, { useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from "@mui/material";
import useRegisterAdmin from "../../hooks/useRegisterAdmin";

const AddAdmin: React.FC<AddAdminProps> = ({ open, onClose, onAddAdmin }) => {
  const { newAdmin, error, handleChange, handleFileChange, submitAdmin, setNewAdmin, fieldErrors } = useRegisterAdmin();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddNewAdmin = async () => {
    const result = await submitAdmin();
  
    console.log(result); // Logghiamo la risposta per vedere cosa succede
  
    if (result.success) {
      setSuccessMessage("Admin added successfully!");
      onAddAdmin(newAdmin);
      setNewAdmin({
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        profileImage: "",
      });
      onClose();
      alert("admin added successfully");
      window.location.reload();
    } else {
      setSuccessMessage(null);
      console.error(result.message);
    }
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
      />
  
      {/* Caricamento immagine */}
      <input
        accept="image/*"
        id="profile-image"
        type="file"
        hidden
        onChange={handleFileChange}
      />
      <label htmlFor="profile-image">
        <Button variant="contained" component="span" sx={{ marginBottom: 2 }}>
          Upload Profile Image
        </Button>
      </label>
  
      {/* Anteprima immagine */}
      {newAdmin.profileImage && (
        <div>
          <img
            src={newAdmin.profileImage}
            alt="Profile Preview"
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              marginTop: '10px',
            }}
          />
        </div>
      )}
    </DialogContent>
  
    {Object.values(fieldErrors).some((err) => err) && (
      <Alert severity="error" sx={{ marginTop: 2 }}>
        Please correct the errors in the form before submitting.
      </Alert>
    )}
  
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
