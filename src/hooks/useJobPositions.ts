import { useState, useEffect } from "react";
import { JobPosition } from "../types/common";
import { useAuthStore } from "../store/useAuthStore";

const useJobPositions = () => {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const authToken = sessionStorage.getItem("token");

  const fetchJobPositions = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/jobPositions`;
        const response = await fetch(apiUrl);

        if (response.status === 401) {
          useAuthStore.getState().handleUnauthorized();
          return;
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

  useEffect(() => {
    fetchJobPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Resolves true only when the API confirmed the new position. */
  const addJobPosition = async (positionData: JobPosition): Promise<boolean> => {
    if (!authToken) {
      useAuthStore.getState().handleUnauthorized();
      return false;
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
        useAuthStore.getState().handleUnauthorized();
        return false;
      }

      if (!response.ok) {
        throw new Error("Failed to add job position.");
      }

      const data = await response.json();
      setJobPositions((prevPositions) => [...prevPositions, data]);
      return true;
    } catch {
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Resolves true only when the API confirmed the deletion. */
  const deleteJobPosition = async (positionId: string, createdAt: string): Promise<boolean> => {
    if (!authToken) {
      useAuthStore.getState().handleUnauthorized();
      return false;
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
        useAuthStore.getState().handleUnauthorized();
        return false;
      }

      if (!response.ok) {
        throw new Error("Failed to delete job position.");
      }

      setJobPositions((prevPositions) => prevPositions.filter((position) => position.positionId !== positionId));
      return true;
    } catch {
      return false;
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
    reload: fetchJobPositions,
  };
};

export default useJobPositions;
