import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { slides } from "../data/slides";
import { useNavigate, useLocation } from "react-router-dom";
import "./carousel.scss";

const yellowBorder = "#FFD700";
const blueBorder = "#1976d2";
const blueTitle = "#1976d2";
const blackTitle = "#000000";

const CardsCarousel: React.FC<{ showCount?: number }> = ({ showCount = 4 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const displayedSlides = slides.slice(0, showCount);
  const isInServices = location.pathname === "/tjänster";

  return (
    <Box
      sx={{
        maxWidth: 1300,
        margin: "auto",
        px: 2,
        py: 4,
       /*  backgroundColor: "rgba(255, 255, 255, 0.85)", */
        padding: "0rem",
        borderRadius: "20px",
      }}
    >
      {/* Titolo */}
      <Typography
        className="carousel-title"
        variant="h4"
        component="h2"
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: blackTitle,
          mb: 4,
        }}
      >
        Våra tjänster
      </Typography>

      {/* Carosello */}
      <Box
        sx={{
          display: {
            xs: "flex",
            md: "grid",
          },
          gap: 2,

          flexWrap: "nowrap",
          overflowX: {
            xs: "auto",
            md: "unset",
          },
          gridTemplateColumns: {
            md: "repeat(auto-fill, minmax(260px, 1fr))",
          },
          paddingBottom: 4,
          scrollSnapType: {
            xs: "x mandatory",
            md: "none",
          },
          px: 1,
          "&::-webkit-scrollbar": {
            height: "8px",
            display: {
              md: "none",
            },
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "yellow",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#388E3C",
          },
        }}
      >
        {displayedSlides.map((slide, i) => (
          <Box
            key={i}
            sx={{
              flex: {
                xs: "0 0 calc(95vw / 1.2)",
                md: "unset",
              },
              maxWidth: 300,
              minWidth: 260,
              padding: 3,
              borderRadius: 2,
              border: `2px solid ${blueBorder}`,
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
              flex: {
                xs: "0 0 calc(95vw / 1.2)",
                md: "unset",
              },
              minWidth: 260,
              maxWidth: 300,
              height: 280,
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

        {/* Spacer mobile finale */}
        <Box
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
            flex: "0 0 5%",
            minWidth: 20,
            height: "100%",
            scrollSnapAlign: "end",
          }}
        />
      </Box>
    </Box>
  );
};

export default CardsCarousel;
