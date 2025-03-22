import React, { useState } from "react";
import { Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import useMessages from "../../hooks/useMessages";
import { formatDate } from "../../utils/dateUtils";

const ClientsMessagesTab: React.FC = () => {
  const { messages, loading, error, deleteMessage } = useMessages("clientMessageId");
  const [openDialog, setOpenDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessageToDelete(messageId);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    if (messageToDelete !== null) {
      deleteMessage(messageToDelete);
      setOpenDialog(false);
      setMessageToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    setMessageToDelete(null);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard
      .writeText(email)
      .then(() => setOpenCopyDialog(true))
      .catch((error) => alert("Error copying email: " + error));
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", marginBottom: 2 }}>
        Client Messages
      </Typography>
      {messages.length > 0 ? (
        messages.map((message) => {
      
          const key = message.clientMessageId || `fallback-${message.name}-${message.email}`;

          return (
            <Box key={key} sx={{ marginBottom: 2, borderBottom: "1px solid #ddd", paddingBottom: 2 }}>
              <Typography>
                <strong>Name:</strong> {message.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {message.email}
              </Typography>
              <Typography>
                <strong>Subject:</strong> {message.subject}
              </Typography>
              <Typography>
                <strong>Message:</strong> {message.textMessage}
              </Typography>
              <Typography>
                <strong>Received:</strong> {formatDate(message.sentAt)}
              </Typography>

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
                onClick={() => handleDeleteMessage(message.clientMessageId)}
                sx={{ marginTop: 1, marginLeft: 2 }}
              >
                Delete Message
              </Button>
            </Box>
          );
        })
      ) : (
        <Typography>No messages found.</Typography>
      )}

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
