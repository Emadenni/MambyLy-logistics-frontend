import { useState } from "react";
import { ApiResponse } from "../types/common";

const useUpdatePassword = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updatePassword = async (adminId: string, newPassword: string) => {
    const token = sessionStorage.getItem("token");
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/admin/password/${adminId}`;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const result: ApiResponse<null> = await response.json(); 

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update password");
      }

      setSuccess(true);

      setTimeout(() => {
        sessionStorage.removeItem("token");
        window.location.href = "/";
      }, 5000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, success, updatePassword };
};

export default useUpdatePassword;
