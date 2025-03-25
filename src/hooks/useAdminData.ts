import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Admin } from "../types/common";

const useAdminData = (adminId: string | null) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!adminId) return;
      setIsLoading(true);

      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("No token found");
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/${adminId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          sessionStorage.removeItem("token");
          alert("Session expired. Please log in again.");
          navigate("/");
          window.location.reload();
          return;
        }

        if (!response.ok) {
          if (response.status === 401) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("adminId");

            alert("Session expired. Please login again");

            navigate("/");

            return;
          }
          throw new Error("Failed to fetch admin data");
        }

        const data = await response.json();
        setAdmin(data);
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

    fetchAdminData();
  }, [adminId, navigate]);

  return { admin, isLoading, error };
};

export default useAdminData;
