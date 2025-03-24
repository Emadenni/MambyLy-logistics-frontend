import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddAdmin from "./AddAdmin";
import useRenderAdmin from "../../hooks/useRenderAdmin";
import { formatDate } from "../../utils/dateUtils";
import { adminValidation } from "../../utils/adminValidation";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const AdminsTab: React.FC = () => {
  const { admins, loading, error, deleteAdmin, updateAdmin } = useRenderAdmin();
  const [openDialog, setOpenDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);
  const [openAddAdmin, setOpenAddAdmin] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null);
  const [updatedData, setUpdatedData] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleDeleteAdmin = (adminId: string) => {
    setAdminToDelete(adminId);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    if (adminToDelete !== null) {
      deleteAdmin(adminToDelete);
      setOpenDialog(false);
      setAdminToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    setAdminToDelete(null);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard
      .writeText(email)
      .then(() => setOpenCopyDialog(true))
      .catch((error) => alert("Error copying email: " + error));
  };

  const handleEditAdmin = (admin: any) => {
    setEditingAdmin(admin);
    setUpdatedData({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      password: "",
    });
  };

  const handleSaveChanges = () => {
    if (editingAdmin) {
      const validationErrors = adminValidation(updatedData);
  
      if (validationErrors.length > 0) {
        alert(validationErrors.join("\n"));
        return;
      }
  
      const updatedAdminData = { ...updatedData };
      if (!isChangingPassword || updatedData.password.trim() === "") {
        delete updatedAdminData.password;
      }
  
      updateAdmin(editingAdmin.adminId, updatedAdminData);
      setEditingAdmin(null);
      setIsChangingPassword(false);
      alert("Admin updated!");
      window.location.reload();
    }
  };

  const handleCancelEdit = () => {
    setEditingAdmin(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", marginBottom: 2 }}>
        Admins List
      </Typography>
      {admins.length > 0 ? (
        admins.map((admin) => {
          const key = admin.adminId || `fallback-${admin.email}`;
          return (
            <Box key={key} sx={{ marginBottom: 2, borderBottom: "1px solid #ddd", paddingBottom: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={admin.profileImageUrl}
                  alt={`${admin.firstName} ${admin.lastName}`}
                  sx={{ width: 80, height: 80, marginRight: 3 }}
                />
                <Box sx={{ width: "100%" }}>
                  {editingAdmin?.adminId === admin.adminId ? (
                    <Box>
                      <TextField
                        label="First Name"
                        name="firstName"
                        value={updatedData.firstName}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                      />
                      <TextField
                        label="Last Name"
                        name="lastName"
                        value={updatedData.lastName}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                      />
                      <TextField
                        label="Email"
                        name="email"
                        value={updatedData.email}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                      />
                      {isChangingPassword ? (
  <TextField
    label="New Password"
    name="password"
    type={showPassword ? "text" : "password"}
    value={updatedData.password}
    onChange={handleInputChange}
    fullWidth
    sx={{ marginBottom: 2 }}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={handleTogglePasswordVisibility} edge="end">
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
) : (
  <Button variant="outlined" color="primary" onClick={() => setIsChangingPassword(true)} sx={{ marginBottom: 2 }}>
    Change Password
  </Button>
)}
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {admin.firstName} {admin.lastName}
                      </Typography>
                      <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        {admin.email || "No email available"}
                      </Typography>
                      <Typography>
                        <strong>Created:</strong> {formatDate(admin.createdAt)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
              {editingAdmin?.adminId === admin.adminId ? (
                <Box>
                  <Button variant="outlined" color="primary" onClick={handleSaveChanges} sx={{ marginTop: 1 }}>
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancelEdit}
                    sx={{ marginTop: 1, marginLeft: 2 }}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleCopyEmail(admin.email)}
                    sx={{ marginTop: 1 }}
                  >
                    Copy Email
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteAdmin(admin.adminId)}
                    sx={{ marginTop: 1, marginLeft: 2 }}
                  >
                    Delete Admin
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleEditAdmin(admin)}
                    sx={{ marginTop: 1, marginLeft: 2 }}
                  >
                    Edit Admin
                  </Button>
                </Box>
              )}
            </Box>
          );
        })
      ) : (
        <Typography>No admins found.</Typography>
      )}

      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this admin?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCopyDialog} onClose={() => setOpenCopyDialog(false)}>
        <DialogTitle>Copied to Clipboard</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenCopyDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Button variant="contained" color="primary" sx={{ marginTop: 3 }} onClick={() => setOpenAddAdmin(true)}>
        Add New Admin
      </Button>

      <AddAdmin open={openAddAdmin} onClose={() => setOpenAddAdmin(false)} />
    </Box>
  );
};

export default AdminsTab;
