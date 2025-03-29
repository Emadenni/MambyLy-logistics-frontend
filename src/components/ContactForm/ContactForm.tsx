import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Select, FormControl, Box, Typography, SelectChangeEvent } from "@mui/material";
import { FormData } from "../../types/common";
import { positionsData } from "../data/positions";
import useSubmitMessages from "../../hooks/useSubmitMessage";
import { microservices } from "../data/microservices";
import { validateForm } from "../../utils/formValidation";

const ContactForm: React.FC<{ subjectFromCard: string; isJobApplication?: boolean }> = ({
  subjectFromCard,
  isJobApplication = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    subject: subjectFromCard || "",
    file: null,
  });

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { isSubmitting, error, handleSubmit } = useSubmitMessages(isJobApplication);

  useEffect(() => {
    if (subjectFromCard) {
      setFormData((prev) => ({ ...prev, subject: subjectFromCard }));
    }
  }, [subjectFromCard]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({ ...formData, [name]: value as string });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFormData((prev) => ({ ...prev, file: selectedFile }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm(formData, isJobApplication);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    const result = await handleSubmit(formData);

    setFormData({
      name: "",
      email: "",
      message: "",
      subject: subjectFromCard || "",
      file: null,
    });

    if (result.success && !error) {
      setSuccessMessage("Tack! Ditt meddelande har skickats.");
    }
  };

  return (
    <Box
      noValidate
      data-testid="contact-form"
      component="form"
      onSubmit={handleFormSubmit}
      sx={{
        maxWidth: 500,
        mx: "auto",
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "rgb(253, 249, 249)",
      }}
    >
      <FormControl fullWidth margin="normal">
        <TextField
          label="Namn / Företag"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          error={!!errors.name}
          helperText={errors.name}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="E-post"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={!!errors.email}
          helperText={errors.email}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        {isJobApplication ? (
          <TextField
            name="subject"
            value={formData.subject || ""}
            onChange={handleChange}
            placeholder=""
            label="Klistra in tjänst-ID eller skriv 'Spontan ansökan'"
            fullWidth
            error={!!errors.subject}
            helperText={errors.subject}
          />
        ) : (
          <Select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            error={!!errors.subject}
          >
            {microservices.map((service, index) => (
              <MenuItem key={index} value={service}>
                {service}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Meddelande"
          name="message"
          multiline
          rows={4}
          value={formData.message}
          onChange={handleChange}
          required
          error={!!errors.message}
          helperText={errors.message}
        />
      </FormControl>

      {isJobApplication && (
        <>
          <FormControl fullWidth margin="normal">
            <Typography variant="body2">Ladda upp ditt CV:</Typography>
            <input type="file" onChange={handleFileChange} required />
            {formData.file && <Typography variant="caption">{formData.file.name}</Typography>}
            {errors.file && <Typography color="error.main" variant="caption">{errors.file}</Typography>}
          </FormControl>
        </>
      )}

      <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Skickar..." : "Skicka"}
      </Button>

      {error && (
        <Typography color="error.main" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {successMessage && (
        <Typography color="success.main" sx={{ mt: 2 }}>
          {successMessage}
        </Typography>
      )}
    </Box>
  );
};

export default ContactForm;
