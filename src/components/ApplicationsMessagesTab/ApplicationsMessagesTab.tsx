import React from "react";
import { Typography, Box } from "@mui/material";
import { fakeApplicationsMessages } from "../../fakeData/fakeApplicationMessages";

const ApplicationsMessagesTab: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6">Messaggi delle Applicazioni</Typography>
      {fakeApplicationsMessages.map((message, index) => (
        <Box key={index} sx={{ marginBottom: 2, borderBottom: "1px solid #ddd", paddingBottom: 2 }}>
          <Typography><strong>Nome:</strong> {message.name}</Typography>
          <Typography><strong>Email:</strong> {message.email}</Typography>
          <Typography><strong>Messaggio:</strong> {message.message}</Typography>
          <Typography><strong>CV:</strong> <a href={message.cv} target="_blank" rel="noopener noreferrer">Scarica CV</a></Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ApplicationsMessagesTab;
