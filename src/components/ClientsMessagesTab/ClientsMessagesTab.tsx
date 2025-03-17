import React, { useState } from "react";
import { Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { fakeCompanyMessages } from "../../fakeData/fakeCompanyMessages";

const ClientsMessagesTab: React.FC = () => {
  const [messages, setMessages] = useState(fakeCompanyMessages);
  const [openDialog, setOpenDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);

  const handleDeleteMessage = (index: number) => {
    setMessageToDelete(index);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    if (messageToDelete !== null) {
      const newMessages = [...messages];
      newMessages.splice(messageToDelete, 1);
      setMessages(newMessages);
      setOpenDialog(false);
      setMessageToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    setMessageToDelete(null);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
      .then(() => setOpenCopyDialog(true))
      .catch((error) => alert("Error copying email: " + error));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6">Client Messages</Typography>
      {messages.filter((message) => !message.subject.includes("Job Application")).map((message, index) => (
        <Box key={index} sx={{ marginBottom: 2, borderBottom: "1px solid #ddd", paddingBottom: 2 }}>
          <Typography><strong>Name:</strong> {message.name}</Typography>
          <Typography><strong>Email:</strong> {message.email}</Typography>
          <Typography><strong>Message:</strong> {message.message}</Typography>
          
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleCopyEmail(message.email)}
            sx={{ marginTop: 1 }}
          >
            Copy Email
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeleteMessage(index)}
            sx={{ marginTop: 1, marginLeft: 2 }}
          >
            Delete Message
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
            Delete
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

export default ClientsMessagesTab;
