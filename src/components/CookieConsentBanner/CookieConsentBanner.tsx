import React, { useState, useEffect } from "react";
import { Button, Box, Typography, Paper } from "@mui/material";
import "./cookieConsentBanner.scss";
import Terms from "../Terms/Terms";

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAllCookies = () => {
    localStorage.setItem("cookieConsent", "all");
    loadAnalytics();
    setShowBanner(false);
  };

  const acceptEssentialOnly = () => {
    localStorage.setItem("cookieConsent", "essential");
    setShowBanner(false);
  };

  const rejectAllCookies = () => {
    localStorage.setItem("cookieConsent", "none");
    setShowBanner(false);
  };

  const loadAnalytics = () => {
    console.log("Analytics / Clarity loaded");
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-banner_container">
      <Paper className="cookie-banner" elevation={6}>
        <Typography variant="body1">
          Vi använder cookies för att förbättra din upplevelse. Du kan välja vilka cookies du accepterar.
        </Typography>
        <Box className="cookie-buttons">
          <Button
            variant="contained"
            color="primary"
            onClick={acceptAllCookies}
          >
            Acceptera alla cookies
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={acceptEssentialOnly}
          >
            Endast nödvändiga cookies
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={rejectAllCookies}
          >
            Avvisa alla cookies
          </Button>
        </Box>
      </Paper>
      <div className="terms">
        <Terms />
      </div>
    </div>
  );
};

export default CookieConsentBanner;
