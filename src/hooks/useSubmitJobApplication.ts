import { useState } from "react";
import { FormData } from "../types/common";
import { validateFormData } from "../utils/validation";

const useSubmitJobApplication = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/jobMessages`;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(""); 

    
    const validationErrors = validateFormData(formData, true);
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

  
    if (formData.file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64File = reader.result?.toString().split(",")[1];
        if (base64File) {
          
          dataToSend.uploadCvBase64 = base64File;

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
              throw new Error(responseBody.error || "Unknown error");
            }

            console.log("Job application submitted successfully");
          } catch (err) {
            setError(`An error occurred: ${err.message || "Unknown error"}`);
          } finally {
            setIsSubmitting(false);
          }
        }
      };
      reader.readAsDataURL(formData.file); 
    } else {
      // Se non ci sono file, invia la richiesta senza allegato
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
          throw new Error(responseBody.error || "Unknown error");
        }

        console.log("Job application submitted successfully");
      } catch (err) {
        setError(`An error occurred: ${err.message || "Unknown error"}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return { isSubmitting, error, handleSubmit };
};

export default useSubmitJobApplication;
