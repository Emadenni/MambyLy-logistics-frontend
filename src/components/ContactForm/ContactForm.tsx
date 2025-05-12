import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  Box,
  Typography,
  SelectChangeEvent,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { FormData } from "../../types/common";
import { microservices } from "../data/microservices";
import useSubmitMessages from "../../hooks/useSubmitMessage";
import { validateForm } from "../../utils/formValidation";
import Terms from "../Terms/Terms";
import ReCAPTCHA from "react-google-recaptcha";

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
    termsAccepted: false,
  });

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const { isSubmitting, error, handleSubmit } = useSubmitMessages(isJobApplication);

  useEffect(() => {
    if (subjectFromCard) {
      setFormData((prev) => ({ ...prev, subject: subjectFromCard }));
    }
  }, [subjectFromCard]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value as string }));

      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFormData((prev) => ({ ...prev, file: selectedFile }));
    }
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptTerms(e.target.checked);
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm(formData, isJobApplication);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0 || !acceptTerms || !captchaValue) { 
      setErrors((prev) => ({
        ...prev,
        terms: "Du måste acceptera villkoren för att skicka formuläret.",
        captcha: "Du måste bekräfta att du inte är en robot." 
      }));
      return;
    }

    const result = await handleSubmit(formData);

    setFormData({
      name: "",
      email: "",
      message: "",
      subject: subjectFromCard || "",
      file: null,
      termsAccepted: false,
    });

    if (result.success && !error) {
      setSuccessMessage("Tack! Ditt meddelande har skickats.");
    }
  };

  return (
    <>
  <Box
  noValidate
  data-testid="contact-form"
  component="form"
  onSubmit={handleFormSubmit}
  sx={{
    maxWidth: 600,
    mx: "auto",
    p: 4,
    boxShadow: 4,
    borderRadius: 3,
    backgroundColor: "#FAFAF9",
    border: "1px solid #E0E0E0",
    "& .MuiTextField-root": {
      borderRadius: 2,
      fontSize: "1rem",
    },
    "@media (min-width: 2560px)": {
  maxWidth: 1200,
  p: 6,
  "& .MuiTextField-root": {
    fontSize: "2rem",
  },
  "& button": {
    fontSize: "2rem",
    padding: "18px 34px",
  },
  "& h6": {
    fontSize: "1.6rem",
  },
  "& label": {
    fontSize: "2rem",
  },
  "& textarea": {
    fontSize: "2rem",
  },
  "& input": {
    fontSize: "2.5rem",
    padding: "38px 34px",
  },
  "& .MuiFormHelperText-root.Mui-error": {
    fontSize: "1.8rem",
  },
}
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
          sx={{
            borderRadius: 2,
            "& .MuiInputBase-root": {
              borderRadius: 2,
              backgroundColor: "#FAFAFA",
              "&:hover": {
                backgroundColor: "#F1F1F1",
              },
            },
          }}
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
          sx={{
            borderRadius: 2,
            "& .MuiInputBase-root": {
              borderRadius: 2,
              backgroundColor: "#FAFAFA",
              "&:hover": {
                backgroundColor: "#F1F1F1",
              },
            },
          }}
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
            sx={{
              borderRadius: 2,
              "& .MuiInputBase-root": {
                borderRadius: 2,
                backgroundColor: "#FAFAFA",
                "&:hover": {
                  backgroundColor: "#F1F1F1",
                },
              },
            }}
          />
        ) : (
          <TextField
            label="Subject *"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            error={!!errors.subject}
            sx={{
              borderRadius: 2,
              "& .MuiInputBase-root": {
                borderRadius: 2,
                backgroundColor: "#FAFAFA",
                "&:hover": {
                  backgroundColor: "#F1F1F1",
                },
              },
            }}
          >
            {microservices.map((service, index) => (
              <MenuItem key={index} value={service}>
                {service}
              </MenuItem>
            ))}
          </TextField>
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
    sx={{
      borderRadius: 2,
      "& .MuiInputBase-root": {
        borderRadius: 2,
        backgroundColor: "#FAFAFA",
        "&:hover": {
          backgroundColor: "#F1F1F1",
        },
      },
      "& .MuiInputBase-inputMultiline": {
        padding: "12px",
        lineHeight: 1.6,
        "@media (min-width: 2560px)": {
          padding: "20px",
          lineHeight: 2,
          fontSize: "2.5rem",
        },
      },
    }}
  />
</FormControl>


{isJobApplication && (
  <FormControl fullWidth margin="normal">
    <Typography
  variant="body2"
  sx={{
    fontWeight: 500,
    mb: 1,
    color: "#4CAF50",
    "@media (min-width: 2560px)": {
      fontSize: "1.85rem", 
    },
  }}
>
  Ladda upp ditt CV:
</Typography>
    <input type="file" onChange={handleFileChange} required />
    {formData.file && (
      <Typography variant="caption" sx={{ mt: 1, color: "gray" }}>
        {formData.file.name}
      </Typography>
    )}
    {errors.file && (
      <Typography
        color="error.main"
        variant="caption"
        sx={{
          "@media (min-width: 2560px)": {
            fontSize: "2rem", 
          },
        }}
      >
        {errors.file}
      </Typography>
    )}
  </FormControl>
)}


<Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
  <FormControlLabel
    control={
      <Checkbox
        checked={acceptTerms}
        onChange={handleTermsChange}
        sx={{
          // default
          "& .MuiSvgIcon-root": {
            fontSize: 24,
          },
          // schermi ≥2560px
          "@media (min-width: 2560px)": {
            "& .MuiSvgIcon-root": {
              fontSize: 34, 
            },
          },
        }}
      />
    }
    label={
      <Box
        sx={{
          fontSize: "0.875rem",
          "@media (min-width: 2560px)": {
            fontSize: "1.8rem",
          },
        }}
      >
        Jag accepterar villkoren. <br />
        <Typography
          variant="caption"
          component="span"
          color="primary"
          sx={{
            cursor: "pointer",
            fontSize: "0.75rem",
            "@media (min-width: 2560px)": {
              fontSize: "1.5rem",
            },
          }}
        >
          Kolla länkarna under formuläret
        </Typography>
      </Box>
    }
  />
  {errors.terms && (
    <Typography
      color="error.main"
      variant="caption"
      sx={{
        fontSize: "0.75rem",
        "@media (min-width: 2560px)": {
          fontSize: "1.8rem",
        },
      }}
    >
      {errors.terms}
    </Typography>
  )}

<FormControl fullWidth margin="normal">
          <ReCAPTCHA
            sitekey="6LeS2TYrAAAAAFF6P92E6zNNIF43uFwZ6KouVLwg" 
            onChange={handleCaptchaChange}
          />
          {errors.captcha && (
            <Typography color="error.main" variant="caption" sx={{ mt: 1 }}>
              {errors.captcha}
            </Typography>
          )}
        </FormControl>
</Box>



      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isSubmitting}
        sx={{
          borderRadius: 3,
          padding: "12px 0",
          marginTop:"20px",
          fontSize: "16px",
          backgroundColor: "#1976D2",
          "&:hover": {
            backgroundColor: "#1565C0",
          },
        }}
      >
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
    
    <Terms /> 
    </>
  );
};

export default ContactForm;
