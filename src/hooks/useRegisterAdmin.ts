import { useState } from "react";
import { adminValidation } from "../utils/adminValidation";
import { AdminData, FieldErrors, ApiResponse } from "../types/common";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const useRegisterAdmin = () => {
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",  // La password è presente qui
    profileImage: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    firstName: null,
    lastName: null,
    email: null,
    password: null,  // Aggiungi errori per la password
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof AdminData) => {
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
      if (message.includes("password")) newFieldErrors.password = message;  // Gestisci l'errore della password
    });

    setFieldErrors(newFieldErrors);

    return errors.length === 0;
  };

  const submitAdmin = async (): Promise<ApiResponse> => {
    const isValid = validateForm();
    if (!isValid) {
      setError("Some field is missing in the form. Check the profile image input");
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

      const data = await response.json();

      if (response.status === 401) {
        useAuthStore.getState().handleUnauthorized();
      }

      if (response.ok) {
        setError(null);
        alert("Admin added successfully");
        window.location.reload();
        return { success: true, message: "Admin added successfully." };
      } else {
        if (data.error === "Email Already in use") {
          setError("This email is already in use.");
          return { success: false, message: "This email is already in use." };
        }

        setError(data.error || "Something went wrong.");
        return { success: false, message: data.error || "Something went wrong." };
      }
    } catch (err) {
      setError("An error occurred while submitting the form.");
      return { success: false, message: "An error occurred while submitting the form." };
    }
  };

  return { newAdmin, error, handleChange, handleFileChange, submitAdmin, setNewAdmin, fieldErrors };
};

export default useRegisterAdmin;
