import { useState } from "react";
import { FormData } from "../types/common";
import { validateFormData } from "../utils/validation";

const useSubmitCompanyMessages = (isJobApplication: boolean) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const apiUrl = isJobApplication 
    ? `${import.meta.env.VITE_API_BASE_URL}/jobMessages` 
    : `${import.meta.env.VITE_API_BASE_URL}/clientsMessages`;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError("");

    const validationErrors = validateFormData(formData, isJobApplication);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      setIsSubmitting(false);
      return { success: false, message: validationErrors.join(", ") };
    }

    const dataToSend: any = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      textMessage: formData.message,
    };

    if (isJobApplication && formData.file) {
      try {
      
        const base64File = await readFileAsBase64(formData.file);
        if (base64File) {
          dataToSend.uploadCvBase64 = base64File; 
        }
      } catch (fileError) {
        setError(`Error reading file: ${fileError.message}`);
        setIsSubmitting(false);
        return { success: false, message: fileError.message || "Unknown file error" };
      }
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

      const responseBody = await response.json();
      console.log("Message sent successfully", responseBody);

      return { success: true, message: responseBody.message };
    } catch (err) {
      console.error("An error occurred:", err);
      setError(`An error occurred: ${err.message || "Unknown error"}`);
      return { success: false, message: err.message || "Unknown error" };
    } finally {
      setIsSubmitting(false);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result?.toString().split(",")[1] || null);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return { isSubmitting, error, handleSubmit };
};

export default useSubmitCompanyMessages;
