import React, { useState } from "react";
import { Box, Avatar, Typography, CircularProgress, Button } from "@mui/material";
import { useAuthStore } from "../../store/useAuthStore";
import useAdminData from "../../hooks/useAdminData";
import useUpdateProfileImage from "../../hooks/useUpdateProfileImage";

const AdminInfoBox: React.FC = () => {
  const adminId = useAuthStore((state) => state.adminId);
  const { admin, isLoading, error } = useAdminData(adminId);
  const { isUploading, error: uploadError, imageUrl, uploadImage } = useUpdateProfileImage();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
            src={imagePreview || imageUrl || admin.profileImageUrl}
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
            <Button variant="contained" component="label" sx={{ marginTop: 2 }} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Change Profile Image"}
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            {uploadError && <Typography color="error">{uploadError}</Typography>}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AdminInfoBox;
