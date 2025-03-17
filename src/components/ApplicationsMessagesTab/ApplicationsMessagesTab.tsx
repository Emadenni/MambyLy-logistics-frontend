import React, { useState } from "react";
import { Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { fakeApplicationsMessages } from "../../fakeData/fakeApplicationMessages";

const ApplicationsMessagesTab: React.FC = () => {
  const [messages, setMessages] = useState(fakeApplicationsMessages);
  const [openDialog, setOpenDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);

  const handleDeleteMessage = (index: number) => {
    setMessageToDelete(index);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    if (messageToDelete !== null) {
      const updatedMessages = [...messages];
      updatedMessages.splice(messageToDelete, 1);
      setMessages(updatedMessages);
    }
    setOpenDialog(false);
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    setMessageToDelete(null);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email).then(() => {
      setOpenCopyDialog(true);
      setTimeout(() => {
        setOpenCopyDialog(false);
      }, 2000);
    });
  };

  return (
    <Box sx={{ padding: 3 }}>
         <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', marginBottom: 2 }}>
               Applications Messages
             </Typography>
      {messages.map((message, index) => (
        <Box key={index} sx={{ marginBottom: 2, borderBottom: "1px solid #ddd", paddingBottom: 2 }}>
          <Typography><strong>Name:</strong> {message.name}</Typography>
          <Typography><strong>Email:</strong> {message.email}</Typography>
          <Typography><strong>Message:</strong> {message.message}</Typography>
          <Typography><strong>CV:</strong> 
            <a href={message.cv} target="_blank" rel="noopener noreferrer">Download CV</a>
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeleteMessage(index)}
            sx={{ marginTop: 1 }}
          >
            Delete Message
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleCopyEmail(message.email)}
            sx={{ marginTop: 1, marginLeft: 1 }}
          >
            Copy Email
          </Button>
        </Box>
      ))}
      
      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this message?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCopyDialog} onClose={() => setOpenCopyDialog(false)}>
        <DialogTitle>Copied to Clipboard</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenCopyDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationsMessagesTab;
