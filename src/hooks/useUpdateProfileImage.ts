import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const useUpdateProfileImage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const uploadImage = async (file: File, adminId: string) => {
    setIsUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        const requestData = {
          base64Image: base64Image,
          mimetype: file.type,
        };

        const token = sessionStorage.getItem("token");
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/admin/updateProfileImage/${adminId}`;

        const response = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(requestData),
        });

        if (response.status === 401) {
          useAuthStore.getState().handleUnauthorized();
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`Image upload failed with status: ${response.status}`);
        }

        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
        } else {
          throw new Error("Unexpected response format: imageUrl not found");
        }
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error("Upload error:", err.message);
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, error, imageUrl, uploadImage };
};

export default useUpdateProfileImage;
