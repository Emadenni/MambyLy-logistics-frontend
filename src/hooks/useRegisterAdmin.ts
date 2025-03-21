import { useState } from "react";
import { adminValidation } from "../utils/adminValidation";
import { AdminData, FieldErrors } from "../types/common";

const useRegisterAdmin = () => {
  const [newAdmin, setNewAdmin] = useState<AdminData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profileImage: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof AdminData) => {
    setNewAdmin({ ...newAdmin, [field]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAdmin({ ...newAdmin, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = adminValidation(newAdmin);
    const newFieldErrors: FieldErrors = {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
    };

    errors.forEach((message) => {
      if (message.includes("firstName")) newFieldErrors.firstName = message;
      if (message.includes("lastName")) newFieldErrors.lastName = message;
      if (message.includes("email")) newFieldErrors.email = message;
      if (message.includes("password")) newFieldErrors.password = message;
    });

    setFieldErrors(newFieldErrors);

    return errors.length === 0;
  };

  const submitAdmin = async (): Promise<{ success: boolean; message?: string }> => {
    const isValid = validateForm();
    if (!isValid) {
      setError("Please fix the form errors.");
      return { success: false, message: "Form validation failed." };
    }

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/admin/register`;
      const token = sessionStorage.getItem("token");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(newAdmin),
      });

      if (response.ok) {
        setError(null);
        return { success: true, message: "Admin added successfully." };
      } else {
        const data = await response.json();
        const errorMessage = data.message || "Something went wrong.";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (err) {
      setError("An error occurred while submitting the form.");
      return { success: false, message: "An error occurred while submitting the form." };
    }
  };

  return { newAdmin, error, handleChange, handleFileChange, submitAdmin, setNewAdmin, fieldErrors };
};

export default useRegisterAdmin;
