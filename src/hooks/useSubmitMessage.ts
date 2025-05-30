import { useState } from "react";
import { FormData, ApiResponse } from "../types/common";

const useSubmitCompanyMessages = (isJobApplication: boolean) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const removeBase64Prefix = (base64String: string) => {
    return base64String.replace(/^data:([A-Za-z-+/]+);base64,/, "");
  };

  const apiUrl = isJobApplication
    ? `${import.meta.env.VITE_API_BASE_URL}/jobMessages`
    : `${import.meta.env.VITE_API_BASE_URL}/clientsMessages`;

  const handleSubmit = async (formData: FormData): Promise<ApiResponse> => {
    setIsSubmitting(true);
    setError("");

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
          const cleanBase64 = removeBase64Prefix(base64File);
          dataToSend.uploadCvBase64 = cleanBase64;
        }
      } catch (fileError: unknown) {
        if (fileError instanceof Error) {
          setError(`Error reading file: ${fileError.message}`);
        } else {
          setError("Unknown error reading file.");
        }
        setIsSubmitting(false);
        return { success: false, message: fileError instanceof Error ? fileError.message : "Unknown file error" };
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
    } catch (err: unknown) {
      console.error("An error occurred:", err);
      setError(`An error occurred: ${err instanceof Error ? err.message : "Unknown error"}`);
      return { success: false, message: err instanceof Error ? err.message : "Unknown error" };
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
