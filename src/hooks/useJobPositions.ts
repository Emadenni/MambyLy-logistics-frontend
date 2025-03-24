import { useState, useEffect } from "react";
import { JobPosition } from "../types/common";
import { validatePositionData } from "../utils/positionValidation";

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
      return newFieldErrors; 
    }

    return {};
  };

  const addJobPosition = async (positionData: JobPosition) => {
    if (!authToken) {
      setError("No authentication token found.");
      return;
    }

    const validationErrors = validateForm(positionData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
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
      alert("Position sucessfully added")
      setFieldErrors({});
      setError(null);
    } catch (err) {
      setError("Failed to add job position.");
    } finally {
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
