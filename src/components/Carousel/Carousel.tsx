import React, { useState, useEffect } from "react";
import "./carousel.scss";
import { Box, Typography } from "@mui/material";
import { slides } from "../data/slides";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  useEffect(() => {
    const intervalId = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: 600, margin: "auto" }}>
      <Box sx={{ padding: 2, textAlign: "center" }}>
 {/*        <img src={slides[currentIndex].icon} alt="icon" className="slide-icon" /> */}
        <Typography variant="h5" className="slide-text">{slides[currentIndex].text}</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        {slides.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: index === currentIndex ? "black" : "lightgray",
              margin: 1,
              cursor: "pointer",
            }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Carousel;
