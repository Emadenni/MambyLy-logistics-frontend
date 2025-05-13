import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminData, ApiResponse, NewAdminData } from "../types/common";
import { useAuthStore } from "../store/useAuthStore";

const useRenderAdmin = () => {
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

      if (response.status === 401) {
        useAuthStore.getState().handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch admins");
      }

      const data: ApiResponse = await response.json();

      if (data && typeof data === "object") {
        const { success, ...adminData } = data;

const adminsArray: AdminData[] = Object.values(adminData).map((admin) => {
  const adminTyped = admin as AdminData; // usa AdminData direttamente

  const createdAtDate = new Date(adminTyped.createdAt);
  const isValidDate = createdAtDate && !isNaN(createdAtDate.getTime()) ? createdAtDate : null;

  return {
    ...adminTyped,
    createdAt: isValidDate ? createdAtDate.toISOString() : "Invalid Date",
  };
});

setAdmins(adminsArray); // nessun errore, il tipo è corretto

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

      if (response.status === 401) {
        alert("Session expired. Please log in again.");
        sessionStorage.removeItem("token");
        navigate("/");
        return;
      }

      if (!response.ok) {
        const responseBody = await response.text();
        if (responseBody.includes("Cannot delete a superadmin")) {
          alert("You cannot delete a superadmin.");
          return;
        }
        throw new Error(`Failed to delete admin: ${responseBody || "Unknown error"}`);
      }

      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== adminId));
      fetchAdmins();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete admin");
    }
  };

  const updateAdmin = async (adminId: string, updatedData: Partial<NewAdminData>) => {
    const token = getToken();
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/admin/${adminId}`;

    const { password, ...filteredData } = updatedData;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filteredData),
      });

      if (response.status === 401) {
        alert("Session expired. Please log in again.");
        sessionStorage.removeItem("token");
        navigate("/");
        return;
      }

      if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(`Failed to update admin: ${responseBody || "Unknown error"}`);
      }

      const updatedAdmin: NewAdminData = await response.json();
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) => (admin.id === adminId ? { ...admin, ...updatedAdmin } : admin))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update admin");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return { admins, loading, error, fetchAdmins, deleteAdmin, updateAdmin };
};

export default useRenderAdmin;
