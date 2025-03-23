import React, { useState } from "react";
import { Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Avatar } from "@mui/material";
import useRenderAdmin from "../../hooks/useRenderAdmin"; // Cambiato a useRenderAdmin
import { formatDate } from "../../utils/dateUtils"; // Se necessario

const AdminsTab: React.FC = () => {
  const { admins, loading, error, deleteAdmin } = useRenderAdmin(); // Usato useRenderAdmin
  const [openDialog, setOpenDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);

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
              </Box>

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
    </Box>
  );
};

export default AdminsTab;
