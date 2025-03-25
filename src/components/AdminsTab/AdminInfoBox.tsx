import React, { useState } from "react";
import { Box, Avatar, Typography, CircularProgress, IconButton } from "@mui/material";
import { useAuthStore } from "../../store/useAuthStore";
import useAdminData from "../../hooks/useAdminData";
import useUpdateProfileImage from "../../hooks/useUpdateProfileImage";
import { useNavigate } from "react-router-dom";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import HomeIcon from "@mui/icons-material/Home";
import LogoutButton from "../LogoutButton/LogoutButton";

const AdminInfoBox: React.FC = () => {
  const adminId = useAuthStore((state) => state.adminId);
  const { admin, isLoading, error } = useAdminData(adminId);
  const { isUploading, error: uploadError, imageUrl, uploadImage } = useUpdateProfileImage();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        uploadImage(file, adminId);
      }
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>

      <Box sx={{ padding: 3, borderBottom: "1px solid #ddd", marginBottom: 3 }}>
        <LogoutButton />
        {admin && (
          <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
            <Avatar
              src={imagePreview || imageUrl || admin.profileImageUrl}
              alt={`${admin.firstName} ${admin.lastName}`}
              sx={{ width: 130, height: 130, marginRight: 3 }}
            />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {admin.firstName} {admin.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Role: {admin.role}
              </Typography>

              <IconButton
                color="primary"
                onClick={() => document.getElementById("file-input")?.click()}
                sx={{ marginTop: 2 }}
              >
                <CameraAltIcon />
              </IconButton>
              <input
                id="file-input"
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
              {uploadError && <Typography color="error">{uploadError}</Typography>}

              <IconButton
                color="primary"
                onClick={handleGoHome}
                sx={{ marginTop: 2, marginLeft: 2 }}
              >
                <HomeIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default AdminInfoBox;
