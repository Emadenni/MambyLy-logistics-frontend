import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import { AdminInfoBoxProps, Admin } from "../../types/common";


const AdminInfoBox: React.FC<AdminInfoBoxProps> = ({ admin }) => {
    return (
      <Box sx={{ padding: 3, borderBottom: "1px solid #ddd", marginBottom: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src={admin.profilePicture} alt={`${admin.firstName} ${admin.lastName}`} sx={{ width: 80, height: 80, marginRight: 3 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {admin.firstName} {admin.lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Role: {admin.role}  {/* Visualizza il ruolo */}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  export default AdminInfoBox;