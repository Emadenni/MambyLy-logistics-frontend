import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const useUpdateProfileImage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  /** Resolves true only when the API returned the new image URL. */
  const uploadImage = async (file: File, adminId: string): Promise<boolean> => {
    setIsUploading(true);
    setError(null);

    try {
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("The image could not be read."));
        reader.readAsDataURL(file);
      });
      {

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
          return false;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`Image upload failed with status: ${response.status}`);
        }

        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
          return true;
        }
        throw new Error("Unexpected response format: imageUrl not found");
      }
    } catch (err: any) {
      console.error("Upload error:", err.message);
      setError("The image could not be uploaded. The previous image is still in use.");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, error, imageUrl, uploadImage };
};

export default useUpdateProfileImage;
