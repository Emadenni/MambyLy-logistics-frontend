import React from "react";
import { Box, Typography } from "@mui/material";
import { slides } from "../data/slides";

const yellowBorder = "#FFD700";
const blueTitle = "#1976d2";

const ServicesGrid: React.FC = () => {
  return (
    <Box
      id="servicesGrid"
      sx={{
        maxWidth: 1600,
        margin: "0 auto",
        px: 2,
        py: 6,
        scrollMarginTop: { xs: "80px", md: "120px" },
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        justifyContent: "center",
      }}
    >
      {slides.map((slide, i) => (
        <Box
          key={i}
          sx={{
            flex: "1 1 320px",
            maxWidth: 320,
            minHeight: 320,
            padding: 4,
            borderRadius: 3,
            border: `2px solid ${yellowBorder}`,
            backgroundColor: "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            transition: "background-color 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              backgroundColor: "#fff9db",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box
            component="img"
            src={slide.icon}
            alt={slide.title}
            loading="lazy"
            sx={{
              width: 60,
              height: 60,
              marginBottom: 3,
              filter: `drop-shadow(0 0 3px ${yellowBorder})`,
            }}
          />
          <Typography
            variant="h5"
            sx={{ color: blueTitle, fontWeight: 700, mb: 2, minHeight: 48 }}
          >
            {slide.title}
          </Typography>
          <Typography variant="body1" sx={{ color: "#222", flexGrow: 1 }}>
            {slide.description}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ServicesGrid;
