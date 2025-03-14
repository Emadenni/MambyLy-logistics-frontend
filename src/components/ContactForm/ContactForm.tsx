import React, { useState } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Input, Typography } from "@mui/material";
import "./contactForm.scss";
import { FormProps, FormData } from "../../types/common";

const ContactForm: React.FC<{ subjectFromCard: string }> = ({ subjectFromCard, isJobApplication = false }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    subject: subjectFromCard,
    file: null,
  });

  const subjects = [
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
    "Övrigt"
  ];
  const jobPositions = ["Frontendutvecklare", "Backendutvecklare", "UI/UX Designer"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulär skickat:", formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 500, mx: "auto", p: 3, boxShadow: 3, borderRadius: 2,  backgroundColor: "rgb(253, 249, 249)" }}
    >
      <FormControl fullWidth margin="normal">
        <TextField label="Namn / Företag" name="name" value={formData.name} onChange={handleChange} required />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField label="E-post" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </FormControl>
      <FormControl fullWidth margin="normal">
  <Select
    name="subject"
    value={formData.subject}
    onChange={handleChange}
    displayEmpty // Mostra il testo predefinito quando nulla è selezionato
  >
    <MenuItem value="" disabled>Välj ämne</MenuItem> {/* Opzione di placeholder */}
    {(isJobApplication ? jobPositions : subjects).map((option) => (
      <MenuItem key={option} value={option}>
        {option}
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
        <FormControl fullWidth margin="normal">
          <Typography variant="body2">Ladda upp ditt CV:</Typography>
          <Input type="file" onChange={handleFileChange} required />
          {formData.file && <Typography variant="caption">{formData.file.name}</Typography>}
        </FormControl>
      )}

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Skicka
      </Button>
    </Box>
  );
};

export default ContactForm;
