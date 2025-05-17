import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import ContactForm from "../../components/ContactForm/ContactForm";
import TitleBox from "../../components/TitleBox/TitleBox";
import "./workWithUs.scss";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Helmet, HelmetProvider } from "react-helmet-async";

const WorkWithUs = () => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isJobApplication, setIsJobApplication] = useState<boolean>(false);

  const handleSelectJob = (jobId: string, isJob: boolean) => {
    setSelectedJobId(jobId);
    setIsJobApplication(isJob);
  };

  return (
    <>
      <Helmet>
        <title>Jobba med oss – Mambyly Solutions</title>
        <meta
          name="description"
          content="Vill du jobba med oss? Se våra lediga tjänster eller skicka in en spontanansökan för att bli konsult inom IT."
        />
        <meta name="keywords" content="jobb, IT-konsult, UX/UI, SEO, blockchain, utvecklare, molnarkitekt" />
        <meta name="author" content="Mambyly Solutions" />
      </Helmet>

      <Layout>
        <div className="workWithUs_wrapper">
          <div className="workWithUs_container">
            <TitleBox
              title="Vill du jobba med oss?"
              subTitle="Kolla de lediga tjänsterna eller skicka in en spontanansökan."
            />

            <Card
              sx={{
                mb: 4,
                borderRadius: 3,
                backgroundColor: "rgba(167, 243, 208, 0.88)",
                border: "1px solid #A7F3D0",
                boxShadow: 2,
                marginBottom: 20,
                marginTop: 5,
                "@media (min-width: 2560px)": {
                  padding: "2rem",
                  "& .MuiTypography-h6": {
                    fontSize: "2.4rem",
                  },
                  "& .MuiTypography-body1": {
                    fontSize: "2rem",
                  },
                  "& .MuiTypography-body2": {
                    fontSize: "1.9rem",
                  },
                  "& ul": {
                    fontSize: "1.8rem",
                  },
                },
                "@media (max-width: 1200px)": {
                  margin: 0,
                  backgroundColor: "rgb(170 243 210)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: "#047857", fontWeight: 600 }}>
                  Just nu har vi inga lediga tjänster.
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: "#065F46" }}>
                  Men du är varmt välkommen att skicka in en spontanansökan! Vi letar ofta efter
                  konsulter inom IT, till exempel:
                </Typography>
                <Box component="ul" sx={{ mt: 2, pl: 3, color: "#065F46" }}>
                  <li>UX/UI Designer</li>
                  <li>SEO Expert</li>
                  <li>Blockchain Consultant</li>
                  <li>Fullstack Developer</li>
                  <li>Cloud Architect</li>
                </Box>
                <Typography variant="body2" sx={{ mt: 2, color: "#047857" }}>
                  Skicka in ditt CV och berätta lite om dig själv – vi hör gärna från dig!
                </Typography>
              </CardContent>
            </Card>

            <ContactForm subjectFromCard={selectedJobId || ""} isJobApplication={true} />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default WorkWithUs;
