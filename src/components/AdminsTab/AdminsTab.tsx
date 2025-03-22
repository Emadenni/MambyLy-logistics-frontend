import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import AddAdmin from "./AddAdmin";
import useRenderAdmin from "../../hooks/useRenderAdmin"; 
import "./adminsTab.scss";

const AdminsTab: React.FC = () => {
  const { admins, loading, error, fetchAdmins } = useRenderAdmin(); 

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null);
  const [openAddAdmin, setOpenAddAdmin] = useState(false);

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

  const handleAddAdmin = (admin: any) => {
    setAdmins([...admins, admin]);
  };


  useEffect(() => {
    fetchAdmins();
  }, []);

  if (loading) {
    return (
      <Box sx={{ padding: 3, display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", marginBottom: 2 }}>
        Admins
      </Typography>
      {admins.map((admin, index) => (
        <Box
          key={index}
          sx={{
            marginBottom: 3,
            borderBottom: "1px solid #ddd",
            paddingBottom: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={admin.profileImageUrl}
              alt={`${admin.firstName} ${admin.lastName}`}
              sx={{ width: 80, height: 80, marginRight: 3 }}
            />
            <Box sx={{ width: "100%" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {admin.firstName} {admin.lastName}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                {admin.email}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
            <Button variant="outlined" color="primary" sx={{ marginRight: 2 }}>
              Edit
            </Button>
            <Button variant="outlined" color="error" onClick={() => handleDeleteAdmin(index)}>
              Delete
            </Button>
          </Box>
        </Box>
      ))}

      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Delete Admin</DialogTitle>
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

      <Button variant="contained" color="primary" sx={{ marginTop: 3 }} onClick={() => setOpenAddAdmin(true)}>
        Add New Admin
      </Button>

      <AddAdmin open={openAddAdmin} onClose={() => setOpenAddAdmin(false)} />
    </Box>
  );
};

export default AdminsTab;
