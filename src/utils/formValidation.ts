import { FormData } from "../../types/common";

export const validateForm = (formData: FormData, isJobApplication: boolean) => {
  let formErrors: { [key: string]: string } = {};

  if (!formData.name || formData.name.length < 2 || formData.name.length > 100) {
    formErrors.name = "Namnet måste vara mellan 2 och 100 tecken lång.";
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!formData.email || !emailPattern.test(formData.email)) {
    formErrors.email = "Ange en giltig e-postadress.";
  }

  if (!formData.message || formData.message.length < 10 || formData.message.length > 2000) {
    formErrors.message = "Meddelandet måste vara mellan 10 och 2000 tecken.";
  }

  if (isJobApplication && !formData.file) {
    formErrors.file = "Vänligen ladda upp ditt CV.";
  }

  return formErrors;
};
