import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const useUpdateProfileImage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const uploadImage = async (file: File, adminId: string) => {
    setIsUploading(true);
    setError(null);
  
    console.log("Uploading file:", file.name, file.type, file.size);
  
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
  
        console.log("Base64 image preview:", base64Image.substring(0, 100)); // Stampiamo solo i primi 100 caratteri
  
        const requestData = {
          base64Image: base64Image,
          mimetype: file.type,
        };
  
        console.log("Sending request with data:", requestData);
  
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
  
        console.log("Response status:", response.status);
  
        if (response.status === 401) {
          useAuthStore.getState().handleUnauthorized();
        }
  
        const data = await response.json();
        console.log("Response data:", data);
  
        if (!response.ok) {
          throw new Error(`Image upload failed with status: ${response.status}`);
        }
  
        if (data.imageUrl) {
          console.log("New image URL:", data.imageUrl);
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
