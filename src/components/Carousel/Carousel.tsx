import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { slides } from "../data/slides";
import { useNavigate, useLocation } from "react-router-dom";

const yellowBorder = "#FFD700";
const blueTitle = "#1976d2";

const CardsCarousel: React.FC<{ showCount?: number }> = ({ showCount = 4 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const displayedSlides = slides.slice(0, showCount);

  const isInServices = location.pathname === "/tjänster";

  return (
    <Box sx={{ maxWidth: 2000, margin: "auto", px: 2, py: 4 }}>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          flexWrap: "nowrap",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: yellowBorder,
            borderRadius: 3,
          },
          scrollSnapType: "x mandatory",
        }}
      >
        {displayedSlides.map((slide, i) => (
          <Box
            key={i}
            sx={{
              flex: { xs: "0 0 75%", sm: "0 0 50%", md: "0 0 30%", lg: "0 0 22%" },
              minWidth: 220,
              maxWidth: 300,
              padding: 3,
              borderRadius: 2,
              border: `2px solid ${yellowBorder}`,
              backgroundColor: "#fff",
              cursor: "default",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: "#fff9db",
              },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              scrollSnapAlign: "start",
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
            <Typography variant="h6" sx={{ color: blueTitle, fontWeight: 600, mb: 1 }}>
              {slide.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#222" }}>
              {slide.description}
            </Typography>
          </Box>
        ))}

        {!isInServices && (
          <Box
            sx={{
              flex: { xs: "0 0 75%", sm: "0 0 50%", md: "0 0 30%", lg: "0 0 22%" },
              minWidth: 220,
              maxWidth: 300,
              padding: 3,
              borderRadius: 2,
              backgroundColor: blueTitle,
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: "#155a9c",
              },
              scrollSnapAlign: "start",
            }}
            onClick={() => navigate("/tjänster#servicesGrid")}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Se alla tjänster
            </Typography>
            <Button
              variant="outlined"
              sx={{
                borderColor: "white",
                color: "white",
                textTransform: "uppercase",
                fontWeight: "bold",
                borderRadius: 50,
                px: 4,
                "&:hover": {
                  borderColor: "#e6e6e6",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              Upptäck mer
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CardsCarousel;
