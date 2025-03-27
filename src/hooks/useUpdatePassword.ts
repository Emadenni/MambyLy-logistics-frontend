import { useState } from "react";

const useUpdatePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
        body: JSON.stringify({ newPassword: newPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      setSuccess(true);

      
      setSuccess(true);
      setTimeout(() => {
        sessionStorage.removeItem("token");
        window.location.href = "/"; 
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, success, updatePassword };
};

export default useUpdatePassword;
