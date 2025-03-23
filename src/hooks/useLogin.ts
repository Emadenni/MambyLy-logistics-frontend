import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ApiResponse } from "../types/common";

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setAdminId = useAuthStore((state) => state.setAdminId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/admin/login`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data: ApiResponse = await response.json();

      if (data.token) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("adminId", data.adminId); // Salvataggio dell'adminId
        setAdminId(data.adminId);
        setIsAuthenticated(true);
        setError("");
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } else {
        setError("Invalid email or password");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    successMessage,
    handleSubmit,
    isLoading,
  };
};

export default useLogin;
