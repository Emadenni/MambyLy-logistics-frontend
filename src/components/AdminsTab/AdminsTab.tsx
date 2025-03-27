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
} from "@mui/material";
import AddAdmin from "./AddAdmin";
import useRenderAdmin from "../../hooks/useRenderAdmin";
import { formatDate } from "../../utils/dateUtils";
import { adminValidation } from "../../utils/adminValidation";
import { Admin } from "../../types/common";

const AdminsTab: React.FC = () => {
  const { admins, loading, error, deleteAdmin, updateAdmin } = useRenderAdmin();
  const [openDialog, setOpenDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);
  const [openAddAdmin, setOpenAddAdmin] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [updatedData, setUpdatedData] = useState<Partial<Admin>>({});

  const handleDeleteAdmin = (adminId: string) => {
    setAdminToDelete(adminId);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    if (adminToDelete !== null) {
      deleteAdmin(adminToDelete).then(() => {
        setOpenDialog(false);
        setAdminToDelete(null);
      });
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

  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setUpdatedData({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
    });
  };

  const handleSaveChanges = () => {
    if (editingAdmin) {
      const validationErrors = adminValidation(updatedData);

      if (validationErrors.length > 0) {
        alert("Something's wrong, fix it: " + validationErrors.join("\n"));
        return;
      }

      const updatedAdminData = { ...updatedData };
      
      updateAdmin(editingAdmin.adminId, updatedAdminData).then(() => {
        setEditingAdmin(null);
        alert(" Admin Updated!");
        const updatedAdmins = admins.map((admin) =>
          admin.adminId === editingAdmin.adminId
            ? { ...admin, ...updatedAdminData }
            : admin
        );
        setUpdatedData({});
        setEditingAdmin(null);
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingAdmin(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">something went wrong: {error}</Typography>;
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
                      <Typography>
                        <strong>Role:</strong> {admin.role}
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
                  <Button variant="outlined" color="secondary" onClick={handleCancelEdit} sx={{ marginTop: 1, marginLeft: 2 }}>
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Button variant="outlined" color="primary" onClick={() => handleCopyEmail(admin.email)} sx={{ marginTop: 1 }}>
                    Copy Email
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteAdmin(admin.adminId)} sx={{ marginTop: 1, marginLeft: 2 }}>
                    Delete Admin
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleEditAdmin(admin)} sx={{ marginTop: 1, marginLeft: 2 }}>
                    Edit Admin
                  </Button>
                </Box>
              )}
            </Box>
          );
        })
      ) : (
        <Typography>No admins found. That’s weird, right?</Typography>
      )}

      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Are you sure? 🤔</DialogTitle>
        <DialogContent>
          <Typography>Are you really sure you want to delete this admin?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Yes, Delete!
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCopyDialog} onClose={() => setOpenCopyDialog(false)}>
        <DialogTitle>Email copied! ✨</DialogTitle>
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
