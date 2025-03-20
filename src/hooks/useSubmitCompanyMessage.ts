import { useState } from "react";
import { FormData } from "../types/common";
import { validateFormData } from "../utils/validation";

const useSubmitCompanyMessages = (isJobApplication: boolean) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/clientsMessages`;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError("");

    const validationErrors = validateFormData(formData, isJobApplication);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      setIsSubmitting(false);
      return;
    }

    const dataToSend: any = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      textMessage: formData.message,
    };

    if (isJobApplication && formData.file) {
      dataToSend.file = formData.file;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        console.error("API Error Response:", responseBody);
        throw new Error(`Error: ${response.statusText}`);
      }

      console.log("Message sent successfully", dataToSend);
    } catch (err) {
      setError(`An error occurred: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, error, handleSubmit };
};

export default useSubmitCompanyMessages;
