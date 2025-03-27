import React, { useState } from "react";
import { Box, Avatar, Typography, CircularProgress, IconButton, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useAuthStore } from "../../store/useAuthStore";
import useAdminData from "../../hooks/useAdminData";
import useUpdateProfileImage from "../../hooks/useUpdateProfileImage";
import useUpdatePassword from "../../hooks/useUpdatePassword"; // Import del nuovo hook
import { useNavigate } from "react-router-dom";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import HomeIcon from "@mui/icons-material/Home";
import LogoutButton from "../LogoutButton/LogoutButton";

const AdminInfoBox: React.FC = () => {
  const adminId = useAuthStore((state) => state.adminId);
  const { admin, isLoading, error } = useAdminData(adminId);
  const { isUploading, error: uploadError, imageUrl, uploadImage } = useUpdateProfileImage();
  const { isLoading: isUpdatingPassword, error: passwordError, success, updatePassword } = useUpdatePassword();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        uploadImage(file, adminId);
      }
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handlePasswordUpdate = () => {
    if (newPassword) {
      updatePassword(adminId, newPassword);
      setOpenPasswordModal(false); // Chiudi il modal dopo l'aggiornamento
    }
  };

  const handleOpenPasswordModal = () => setOpenPasswordModal(true); // Apre il modal
  const handleClosePasswordModal = () => setOpenPasswordModal(false); // Chiude il modal

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Box sx={{ padding: 3, borderBottom: "1px solid #ddd", marginBottom: 3 }}>
        <LogoutButton />
        {admin && (
          <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
            <Avatar
              src={imagePreview || imageUrl || admin.profileImageUrl}
              alt={`${admin.firstName} ${admin.lastName}`}
              sx={{ width: 120, height: 120, marginRight: 3 }}
            />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {admin.firstName} {admin.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {admin.email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Role: {admin.role}
              </Typography>

              <IconButton
                color="primary"
                onClick={() => document.getElementById("file-input")?.click()}
                sx={{ marginTop: 2 }}
              >
                <CameraAltIcon />
              </IconButton>
              <input
                id="file-input"
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
              {uploadError && <Typography color="error">{uploadError}</Typography>}

              <IconButton
                color="primary"
                onClick={handleGoHome}
                sx={{ marginTop: 2, marginLeft: 2 }}
              >
                <HomeIcon />
              </IconButton>

         
              <Button
                onClick={handleOpenPasswordModal}
                variant="text"
                sx={{
                  marginTop: 2,
                  color: "primary.main",
                  textTransform: "none",
                  fontSize: "14px",
                }}
              >
                Update Password
              </Button>
            </Box>
          </Box>
        )}
      </Box>

 
      <Dialog open={openPasswordModal} onClose={handleClosePasswordModal}>
        <DialogTitle>Update Password</DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          {passwordError && <Typography color="error">{passwordError}</Typography>}
          {success && <Typography color="success.main">Password updated successfully!</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordModal} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handlePasswordUpdate}
            variant="contained"
            color="primary"
            disabled={isUpdatingPassword}
          >
            {isUpdatingPassword ? "Updating..." : "Update Password"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminInfoBox;
