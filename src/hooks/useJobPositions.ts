import { useState, useEffect } from "react";
import { JobPosition } from "../types/common";

const useJobPositions = () => {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobPositions = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/jobPositions`;
        const response = await fetch(apiUrl);

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

  return { jobPositions, loading, error };
};

export default useJobPositions;
