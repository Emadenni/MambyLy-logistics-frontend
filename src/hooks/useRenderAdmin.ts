import { useEffect, useState } from "react";
import { AdminData, ApiResponse } from "../types/common";

const useRenderAdmin = () => {
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => sessionStorage.getItem("token");

  const fetchAdmins = async () => {
    const token = getToken();
    setLoading(true);
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/admin`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch admins");
      }

      const data: ApiResponse = await response.json();

      if (data && typeof data === "object") {
   
        const { success, ...adminData } = data;

        const adminsArray = Object.values(adminData).map((admin: AdminData) => {
          const createdAtString = admin.createdAt;
          let createdAtDate: Date | null = null;

          if (typeof createdAtString === "string") {
            createdAtDate = new Date(createdAtString);
          }

          const isValidDate = createdAtDate && !isNaN(createdAtDate.getTime()) ? createdAtDate : null;

          return {
            ...admin,
            createdAt: isValidDate ? createdAtDate.toISOString() : "Invalid Date",
          };
        });

        setAdmins(adminsArray);
      } else {
        throw new Error("Invalid response structure: Data is not an object");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (adminId: string) => {
    const token = getToken();
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/admin/${adminId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(`Failed to delete admin: ${responseBody || "Unknown error"}`);
      }

      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== adminId));
      alert("Admin deleted successfully");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete admin");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return { admins, loading, error, fetchAdmins, deleteAdmin };
};

export default useRenderAdmin;
