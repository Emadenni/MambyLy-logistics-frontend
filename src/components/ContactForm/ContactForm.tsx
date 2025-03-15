import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography } from "@mui/material";
import "./contactForm.scss";
import { FormData } from "../../types/common";
import { positionsData } from "../data/positions";

const microservices = [
  "Pallsläp (Tautliner / Gardinsläp)",
  "Kylsläp (Kyl- och frystransport)",
  "Containersläp (Flak / Chassisläp)",
  "Tanksläp",
  "Flaksläp (Öppet släp)",
  "Gånggolvssläp (Walking Floor)",
  "Lastbil med bakgavellyft",
  "Släpförflyttning & repositionering",
  "Förlastning & släphantering",
  "Grundläggande digitala verktyg",
  "Skräddarsydda logistiklösningar",
  "Webbappar & specialbyggda system",
  "Övrigt",
];

const ContactForm: React.FC<{ subjectFromCard: string; isJobApplication?: boolean }> = ({
  subjectFromCard,
  isJobApplication = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    subject: subjectFromCard || "Spontan ansökan",
    file: null,
  });

  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    if (subjectFromCard) {
      setFormData((prev) => ({ ...prev, subject: subjectFromCard }));
    }
  }, [subjectFromCard]);

  const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) setFormData({ ...formData, [name]: value as string });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFormData((prev) => ({ ...prev, file: selectedFile }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isJobApplication && !formData.file) {
      alert("Vänligen ladda upp ditt CV.");
      return;
    }

    console.log("Formulär skickat:", formData);
    setSuccessMessage("Tack! Ditt meddelande har skickats.");

    setFormData({
      name: "",
      email: "",
      message: "",
      subject: subjectFromCard || "Spontan ansökan",
      file: null,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
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
        <TextField label="Namn / Företag" name="name" value={formData.name} onChange={handleChange} required />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField label="E-post" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Välj postion</InputLabel>
        <Select name="subject" value={formData.subject} onChange={handleChange}>
        {isJobApplication ? (
      <MenuItem value="Spontan ansökan">Spontan ansökan</MenuItem>
    ) : null}
          {isJobApplication
            ? positionsData.map((position) => (
              
                <MenuItem key={position.id} value={position.id}>
                  {position.id}
                </MenuItem>
              ))
            : microservices.map((service, index) => (
                <MenuItem key={index} value={service}>
                  {service}
                </MenuItem>
              ))}
        </Select>
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
        />
      </FormControl>

      {isJobApplication && (
        <>
          <FormControl fullWidth margin="normal">
            <Typography variant="body2">Ladda upp ditt CV:</Typography>
            <input type="file" onChange={handleFileChange} required />
            {formData.file && <Typography variant="caption">{formData.file.name}</Typography>}
          </FormControl>
        </>
      )}

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Skicka
      </Button>

      {successMessage && (
        <Typography color="success.main" sx={{ mt: 2 }}>
          {successMessage}
        </Typography>
      )}
    </Box>
  );
};

export default ContactForm;
