import React from "react";
import { Typography, Box } from "@mui/material";
import { positionsData } from "../data/positions";

const JobPositionsTab: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6">Posizioni Lavorative</Typography>
      {positionsData.map((position, index) => (
        <Box key={index} sx={{ marginBottom: 2, borderBottom: "1px solid #ddd", paddingBottom: 2 }}>
          <Typography><strong>Partenza:</strong> {position.departure}</Typography>
          <Typography><strong>Destinazione:</strong> {position.destination}</Typography>
          <Typography><strong>Distanza:</strong> {position.distance}</Typography>
          <Typography><strong>Tipo di Servizio:</strong> {position.serviceType}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default JobPositionsTab;
