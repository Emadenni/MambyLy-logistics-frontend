import React from "react";
import { Typography, Box, Avatar } from "@mui/material";
import { fakeAdmins } from "../../fakeData/fakeAdmins";

const AdminsTab: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6">Amministratori</Typography>
      {fakeAdmins.map((admin, index) => (
        <Box key={index} sx={{ marginBottom: 2, borderBottom: "1px solid #ddd", paddingBottom: 2, display: "flex", alignItems: "center" }}>
          <Avatar src={admin.profilePicture} alt={`${admin.firstName} ${admin.lastName}`} sx={{ marginRight: 2 }} />
          <Box>
            <Typography><strong>Nome:</strong> {admin.firstName} {admin.lastName}</Typography>
            <Typography><strong>Username:</strong> {admin.username}</Typography>
            <Typography><strong>Password:</strong> {admin.password}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AdminsTab;
