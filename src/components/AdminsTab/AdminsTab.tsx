import React, { useState } from "react";
import { Typography, Box, Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { fakeAdmins } from "../../fakeData/fakeAdmins";

const AdminsTab: React.FC = () => {
  const [admins, setAdmins] = useState(fakeAdmins);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null);
  const [editingAdminIndex, setEditingAdminIndex] = useState<number | null>(null);
  const [editedAdmin, setEditedAdmin] = useState<any | null>(null);
  const [openAddAdmin, setOpenAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    profilePicture: "",
  });

  const handleDeleteAdmin = (index: number) => {
    setAdminToDelete(index);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (adminToDelete !== null) {
      const newAdmins = [...admins];
      newAdmins.splice(adminToDelete, 1);
      setAdmins(newAdmins);
      setOpenDeleteDialog(false);
      setAdminToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setAdminToDelete(null);
  };

  const handleEditAdmin = (index: number) => {
    setEditingAdminIndex(index);
    setEditedAdmin({ ...admins[index] });
  };

  const handleSaveEdit = () => {
    if (editingAdminIndex !== null && editedAdmin) {
      const newAdmins = [...admins];
      newAdmins[editingAdminIndex] = editedAdmin;
      setAdmins(newAdmins);
      setEditingAdminIndex(null);
      setEditedAdmin(null);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (editedAdmin) {
      setEditedAdmin({
        ...editedAdmin,
        [field]: event.target.value,
      });
    } else {
      setNewAdmin({
        ...newAdmin,
        [field]: event.target.value,
      });
    }
  };

  const handleAddNewAdmin = () => {
    setAdmins([...admins, newAdmin]);
    setOpenAddAdmin(false);
    setNewAdmin({
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      profilePicture: "",
    });
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', marginBottom: 2 }}>
    Admins
  </Typography>
      {admins.map((admin, index) => (
        <Box key={index} sx={{ marginBottom: 3, borderBottom: "1px solid #ddd", paddingBottom: 2, display: "flex", flexDirection: "column" }}>
          {editingAdminIndex === index ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                <Avatar src={admin.profilePicture} alt={`${admin.firstName} ${admin.lastName}`} sx={{ width: 80, height: 80, marginRight: 3 }} />
                <Box sx={{ width: "100%" }}>
                  <TextField
                    label="First Name"
                    value={editedAdmin.firstName}
                    onChange={(e) => handleChange(e, "firstName")}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                  <TextField
                    label="Last Name"
                    value={editedAdmin.lastName}
                    onChange={(e) => handleChange(e, "lastName")}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                  <TextField
                    label="Username"
                    value={editedAdmin.username}
                    onChange={(e) => handleChange(e, "username")}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                  <TextField
                    label="Password"
                    value={editedAdmin.password}
                    onChange={(e) => handleChange(e, "password")}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                  <TextField
                    label="Profile Picture URL"
                    value={editedAdmin.profilePicture}
                    onChange={(e) => handleChange(e, "profilePicture")}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                <Button variant="outlined" color="primary" onClick={handleSaveEdit} sx={{ marginRight: 2 }}>
                  Save Changes
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setEditingAdminIndex(null)}>
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                <Avatar src={admin.profilePicture} alt={`${admin.firstName} ${admin.lastName}`} sx={{ width: 80, height: 80, marginRight: 3 }} />
                <Box sx={{ width: "100%" }}>
                  <Typography><strong>Name:</strong> {admin.firstName} {admin.lastName}</Typography>
                  <Typography><strong>Username:</strong> {admin.username}</Typography>
                  <Typography><strong>Password:</strong> {admin.password}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                <Button variant="outlined" color="primary" onClick={() => handleEditAdmin(index)} sx={{ marginRight: 2 }}>
                  Edit Admin
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDeleteAdmin(index)}>
                  Delete Admin
                </Button>
              </Box>
            </>
          )}
        </Box>
      ))}

      <Button variant="contained" color="primary" onClick={() => setOpenAddAdmin(true)} sx={{ marginTop: 3 }}>
        + Add New Admin
      </Button>

      {openAddAdmin && (
        <Box sx={{ marginTop: 2, padding: 2, border: "1px solid #ddd" }}>
          <Typography variant="h6">Add New Admin</Typography>
          <TextField
            label="First Name"
            value={newAdmin.firstName}
            onChange={(e) => handleChange(e, "firstName")}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Last Name"
            value={newAdmin.lastName}
            onChange={(e) => handleChange(e, "lastName")}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Username"
            value={newAdmin.username}
            onChange={(e) => handleChange(e, "username")}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Password"
            value={newAdmin.password}
            onChange={(e) => handleChange(e, "password")}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Profile Picture URL"
            value={newAdmin.profilePicture}
            onChange={(e) => handleChange(e, "profilePicture")}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddNewAdmin} sx={{ marginTop: 2 }}>
            Add Admin
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => setOpenAddAdmin(false)} sx={{ marginTop: 2, marginLeft: 2 }}>
            Cancel
          </Button>
        </Box>
      )}

      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
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
    </Box>
  );
};

export default AdminsTab;
