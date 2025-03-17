import { useState } from "react";
import { FormData } from "../types/common";

const useSubmitCompanyMessages = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      // Predisposizione per la chiamata API
      // Puoi decommentare questa parte quando vuoi fare la richiesta vera
      /*
      await fetch("/api/submit-contact-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      */

      console.log("Message sent successfully", formData);
    } catch (err) {
      setError("An error occurred while sending the message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, error, handleSubmit };
};

export default useSubmitCompanyMessages;
