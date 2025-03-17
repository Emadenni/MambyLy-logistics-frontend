import React from "react";
import { Typography, Box } from "@mui/material";
import { fakeCompanyMessages } from "../../fakeData/fakeCompanyMessages";

const ClientsMessagesTab: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6">Messaggi dei Clienti</Typography>
      {fakeCompanyMessages.filter((message) => !message.subject.includes("Job Application")).map((message, index) => (
        <Box key={index} sx={{ marginBottom: 2, borderBottom: "1px solid #ddd", paddingBottom: 2 }}>
          <Typography><strong>Nome:</strong> {message.name}</Typography>
          <Typography><strong>Email:</strong> {message.email}</Typography>
          <Typography><strong>Messaggio:</strong> {message.message}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ClientsMessagesTab;
