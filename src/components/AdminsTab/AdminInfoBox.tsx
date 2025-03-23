import React, { useEffect, useState } from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { useAuthStore } from "../../store/useAuthStore";

const AdminInfoBox: React.FC = () => {
  const adminId = useAuthStore((state) => state.adminId);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (adminId) {
      fetchAdminData(adminId);
    }
  }, [adminId]);

  const fetchAdminData = async (id: string) => {
    try {
      const token = sessionStorage.getItem("token"); // Prendi il token dalla sessionStorage o dallo store
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Aggiungi il token nell'header Authorization
          "Content-Type": "application/json",  // Specifica il Content-Type
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch admin data");
      }

      const data = await response.json();
      setAdmin(data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  return (
    <Box sx={{ padding: 3, borderBottom: "1px solid #ddd", marginBottom: 3 }}>
      {admin && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src={admin.profileImageUrl} alt={`${admin.firstName} ${admin.lastName}`} sx={{ width: 80, height: 80, marginRight: 3 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
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
