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
import { updateAdminValidation } from "../../utils/updateAdminValidation";
import { Admin, AdminData } from "../../types/common";

const AdminsTab: React.FC = () => {
  const { admins, loading, error, deleteAdmin, updateAdmin, fetchAdmins } = useRenderAdmin();
  const [openDialog, setOpenDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);
  const [openAddAdmin, setOpenAddAdmin] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminData | null>(null);
  const [updatedData, setUpdatedData] = useState<Partial<AdminData>>({});

  const handleDeleteAdmin = (adminId: string) => {
    setAdminToDelete(adminId);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    if (adminToDelete) {
      deleteAdmin(adminToDelete).then(() => {
        setOpenDialog(false);
        setAdminToDelete(null);
        fetchAdmins();
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

  const handleEditAdmin = (admin: AdminData) => {
    setEditingAdmin(admin);
    setUpdatedData({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
    });
  };

  const handleSaveChanges = () => {
    if (!editingAdmin) return;

    const validationErrors = updateAdminValidation(updatedData as AdminData);
    if (validationErrors.length > 0) {
      alert("Something's wrong, fix it: " + validationErrors.join("\n"));
      return;
    }

    // Ensure all required fields are present by merging with existing
    const updatedAdminData: AdminData = {
      ...editingAdmin,
      ...updatedData,
    };

    updateAdmin(editingAdmin.adminId, updatedAdminData).then(() => {
      setEditingAdmin(null);
      setUpdatedData({});
      alert("Admin Updated!");
      fetchAdmins();
    });
  };

  const handleCancelEdit = () => {
    setEditingAdmin(null);
    setUpdatedData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">something went wrong: {error}</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", marginBottom: 2 }}>
        Admins List
      </Typography>

      {admins.length > 0 ? (
        admins.map((admin) => {
          const isEditing = editingAdmin?.adminId === admin.adminId;
          return (
            <Box key={admin.adminId} sx={{ mb: 2, borderBottom: "1px solid #ddd", pb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar src={admin.profileImageUrl} alt={`${admin.firstName} ${admin.lastName}`} sx={{ width: 80, height: 80, mr: 3 }} />
                <Box sx={{ width: "100%" }}>
                  {isEditing ? (
                    <>
                      <TextField label="First Name" name="firstName" value={updatedData.firstName || ''} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
                      <TextField label="Last Name" name="lastName" value={updatedData.lastName || ''} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
                      <TextField label="Email" name="email" value={updatedData.email || ''} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
                      <TextField label="Role" name="role" value={updatedData.role || ''} onChange={handleInputChange} fullWidth sx={{ mb: 2 }} />
                    </>
                  ) : (
                    <>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {admin.firstName} {admin.lastName}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {admin.email}
                      </Typography>
                      <Typography><strong>Created:</strong> {formatDate(admin.createdAt)}</Typography>
                      <Typography><strong>Role:</strong> {admin.role}</Typography>
                    </>
                  )}
                </Box>
              </Box>

              <Box sx={{ mt: 1 }}>
                {isEditing ? (
                  <>
                    <Button variant="outlined" onClick={handleSaveChanges}>Save Changes</Button>
                    <Button variant="outlined" color="secondary" sx={{ ml: 2 }} onClick={handleCancelEdit}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outlined" onClick={() => handleCopyEmail(admin.email)}>Copy Email</Button>
                    <Button variant="outlined" color="error" sx={{ ml: 2 }} onClick={() => handleDeleteAdmin(admin.adminId)}>Delete Admin</Button>
                    <Button variant="outlined" color="secondary" sx={{ ml: 2 }} onClick={() => handleEditAdmin(admin)}>Edit Admin</Button>
                  </>
                )}
              </Box>
            </Box>
          );
        })
      ) : (
        <Typography>No admins found. That’s weird, right?</Typography>
      )}

      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Are you sure? 🤔</DialogTitle>
        <DialogContent><Typography>Are you really sure you want to delete this admin?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>Yes, Delete!</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCopyDialog} onClose={() => setOpenCopyDialog(false)}>
        <DialogTitle>Email copied! ✨</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenCopyDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Button variant="contained" sx={{ mt: 3 }} onClick={() => setOpenAddAdmin(true)}>Add New Admin</Button>
      <AddAdmin open={openAddAdmin} onClose={() => setOpenAddAdmin(false)} onAddAdmin={() => {/* implement callback */}} />
    </Box>
  );
};

export default AdminsTab;
