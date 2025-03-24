import { useState, useEffect } from "react";
import { JobPosition } from "../types/common";
import { validatePositionData } from "../utils/postionSchema";

const useJobPositions = () => {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const authToken = sessionStorage.getItem("token");

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

  const validateForm = (formData: JobPosition) => {
    const errors = validatePositionData(formData);
    const newFieldErrors: { [key: string]: string } = {};

    if (errors.length > 0) {
      errors.forEach((error) => {
        const match = error.match(/"([^"]+)"/);
        if (match && match[1]) {
          newFieldErrors[match[1]] = error;
        }
      });
      setFieldErrors(newFieldErrors);
    } else {
      setFieldErrors({});
    }
  };

  const addJobPosition = async (positionData: JobPosition) => {
    if (!authToken) {
      setError("No authentication token found.");
      return;
    }

    validateForm(positionData);

    if (Object.keys(fieldErrors).length > 0) {
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

      if (!response.ok) {
        throw new Error("Failed to add job position.");
      }

      const data = await response.json();
      setJobPositions((prevPositions) => [...prevPositions, data]);

      setFieldErrors({});
      setIsSubmitting(false);
    } catch (err) {
      setError("Failed to add job position.");
      setIsSubmitting(false);
    }
  };

  return {
    jobPositions,
    loading,
    error,
    fieldErrors,
    addJobPosition,
    isSubmitting,
    setJobPositions
  };
};

export default useJobPositions;
