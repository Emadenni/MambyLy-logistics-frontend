import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { slides } from "../data/slides";

const yellowBorder = "#FFD700";
const blueTitle = "#1976d2";

const ServicesGrid: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 1600, margin: "auto", px: 2, py: 4 }}>
      <Grid container spacing={4}>
        {slides.map((slide, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <Box
              sx={{
                padding: 3,
                borderRadius: 2,
                border: `2px solid ${yellowBorder}`,
                backgroundColor: "#fff",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: "#fff9db",
                },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                height: "100%",
              }}
            >
              <img
                src={slide.icon}
                alt={slide.title}
                loading="lazy"
                style={{
                  width: 60,
                  height: 60,
                  marginBottom: 12,
                  filter: `drop-shadow(0 0 2px ${yellowBorder})`,
                }}
              />
              <Typography
                variant="h6"
                sx={{ color: blueTitle, fontWeight: 600, mb: 1 }}
              >
                {slide.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#222" }}>
                {slide.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesGrid;
