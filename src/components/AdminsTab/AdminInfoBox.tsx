import React from "react";
import { Box, Avatar, Typography, CircularProgress } from "@mui/material";
import { useAuthStore } from "../../store/useAuthStore";
import useAdminData from "../../hooks/useAdminData";

const AdminInfoBox: React.FC = () => {
  const adminId = useAuthStore((state) => state.adminId);
  const { admin, isLoading, error } = useAdminData(adminId);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 3, borderBottom: "1px solid #ddd", marginBottom: 3 }}>
      {admin && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={admin.profileImageUrl}
            alt={`${admin.firstName} ${admin.lastName}`}
            sx={{ width: 80, height: 80, marginRight: 3 }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {admin.firstName} {admin.lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Role: {admin.role}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AdminInfoBox;
