import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  CircularProgress,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
} from "@mui/material";
import { useAuthStore } from "../../store/useAuthStore";
import useAdminData from "../../hooks/useAdminData";
import useUpdateProfileImage from "../../hooks/useUpdateProfileImage";
import useUpdatePassword from "../../hooks/useUpdatePassword";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../LogoutButton/LogoutButton";
import MenuIcon from "@mui/icons-material/Menu";
import { AdminData } from "../../types/common";

const AdminInfoBox: React.FC = () => {
  const adminId = useAuthStore((state) => state.adminId);
  const { admin, isLoading, error } = useAdminData(adminId);
  const { isUploading, error: uploadError, imageUrl, uploadImage } = useUpdateProfileImage();
  const { isLoading: isUpdatingPassword, error: passwordError, success, updatePassword } = useUpdatePassword();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      uploadImage(file, adminId);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword) {
      await updatePassword(adminId, newPassword);
      setTimeout(() => setOpenPasswordModal(false), 3000);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

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
              <IconButton color="primary" onClick={handleMenuOpen} sx={{ marginTop: 2 }}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => navigate("/")}>Go Home</MenuItem>
        <MenuItem onClick={() => setOpenPasswordModal(true)}>Update Password</MenuItem>
        <MenuItem onClick={() => document.getElementById("file-input")?.click()}>Change Profile Image</MenuItem>
        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
      </Menu>
      <Dialog open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
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
          {success && <Typography color="success.main">Password updated successfully! Wait to be logged out..</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handlePasswordUpdate} variant="contained" color="primary" disabled={isUpdatingPassword}>
            {isUpdatingPassword ? "Updating..." : "Update Password"}
          </Button>
        </DialogActions>
      </Dialog>
      <input id="file-input" type="file" hidden accept="image/*" onChange={handleImageChange} />
    </>
  );
};

export default AdminInfoBox;
