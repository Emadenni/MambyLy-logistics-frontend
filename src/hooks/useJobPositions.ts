import { useState, useEffect } from "react";
import { JobPosition } from "../types/common";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const useJobPositions = () => {
  const navigate = useNavigate();
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const authToken = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchJobPositions = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/jobPositions`;
        const response = await fetch(apiUrl);

        if (response.status === 401) {
          useAuthStore.getState().handleUnauthorized();
        }

        if (!response.ok) {
          throw new Error("Failed to fetch job positions.");
        }

        const data = await response.json();
        const positionsArray = Object.keys(data)
          .filter((key) => key !== "success")
          .map((key) => data[key]);

        setJobPositions(positionsArray);
      } catch (err) {
        setError("Failed to fetch job positions.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobPositions();
  }, []);

  const addJobPosition = async (positionData: JobPosition) => {
    if (!authToken) {
      setError("No authentication token found.");
      return;
    }

    try {
      setIsSubmitting(true);
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/jobPositions`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(positionData),
      });

      if (response.status === 401) {
        sessionStorage.removeItem("token");
        alert("Session expired. Please log in again.");
        navigate("/");
        window.location.reload();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to add job position.");
      }

      const data = await response.json();
      setJobPositions((prevPositions) => [...prevPositions, data]);
      alert("Position successfully added");
      setError(null);
    } catch (err) {
      setError("Failed to add job position.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteJobPosition = async (positionId: string, createdAt: string) => {
    if (!authToken) {
      setError("No authentication token found.");
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/jobPositions/${positionId}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ createdAt }),
      });

      if (response.status === 401) {
        sessionStorage.removeItem("token");
        alert("Session expired. Please log in again.");
        navigate("/");
        window.location.reload();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete job position.");
      }

      setJobPositions((prevPositions) => prevPositions.filter((position) => position.positionId !== positionId));
      alert("Position successfully deleted.");
    } catch (err) {
      setError("Failed to delete job position.");
    }
  };

  return {
    jobPositions,
    loading,
    error,
    addJobPosition,
    isSubmitting,
    setJobPositions,
    deleteJobPosition,
  };
};

export default useJobPositions;
