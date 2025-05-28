import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useJobPositions from "../../hooks/useJobPositions";
import { formatDate } from "../../utils/dateUtils";

interface PositionInput {
  positionId: string;
  createdAt: string;
  departure: string;
  destination: string;
  distance: number | string; // <-- accetta anche stringa
  type: string;
}

const JobPositionsTab: React.FC = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<number | null>(null);
  const [openAddPosition, setOpenAddPosition] = useState(false);

const [newPosition, setNewPosition] = useState<PositionInput>({
  positionId: "", 
  createdAt: "",  
  departure: "",
  destination: "",
  distance: "", 
  type: "",
});

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof PositionInput, string>>>({});

  const {
    jobPositions,
    loading,
    error,
    setJobPositions,
    addJobPosition,
    deleteJobPosition,
  } = useJobPositions();

  const handleDeletePosition = (index: number) => {
    setPositionToDelete(index);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (positionToDelete !== null) {
      const position = jobPositions[positionToDelete];
      const { positionId, createdAt } = position;
      await deleteJobPosition(positionId, createdAt);
      setOpenDeleteDialog(false);
      setPositionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setPositionToDelete(null);
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof PositionInput
  ) => {
    const { value } = e.target;
    setNewPosition((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const validatePositionData = (data: PositionInput) => {
    const errors: Partial<Record<keyof PositionInput, string>> = {};
    if (!data.departure) errors.departure = "Departure is required";
    if (!data.destination) errors.destination = "Destination is required";
    if (!data.distance) errors.distance = "Distance is required";
    if (!data.type) errors.type = "Service type is required";
    return errors;
  };

  const handleAddNewPosition = async () => {
    const errors = validatePositionData(newPosition);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
await addJobPosition({
  ...newPosition,
  distance: Number(newPosition.distance),
});
  };

  if (loading) {
    return (
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", marginBottom: 2 }}>
        Job Positions
      </Typography>

      {jobPositions.map((position, index) => (
        <Accordion key={position.positionId || index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{position.positionId || `Position #${index}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List data-testid="available-positions">
              <ListItem>
                <ListItemText primary="Avgång" secondary={position.departure || "Ingen tillgänglig"} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Destination" secondary={position.destination || "Ingen tillgänglig"} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Antal km" secondary={position.distance || "Ingen tillgänglig"} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Typ av tjänst" secondary={position.type || "Ingen tillgänglig"} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Created At" secondary={formatDate(position.createdAt) || "Ingen tillgänglig"} />
              </ListItem>
            </List>
          </AccordionDetails>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeletePosition(index)}
            sx={{ marginTop: 1, ml: 2 }}
          >
            Delete Position
          </Button>
        </Accordion>
      ))}

      <Button variant="contained" color="primary" onClick={() => setOpenAddPosition(true)} sx={{ marginTop: 2 }}>
        + Add New Position
      </Button>

      {openAddPosition && (
        <Box sx={{ marginTop: 2, padding: 2, border: "1px solid #ddd" }}>
          <Typography variant="h6" gutterBottom>
            Add New Position
          </Typography>

          <TextField
            label="Departure"
            value={newPosition.departure}
            onChange={(e) => handleFieldChange(e, "departure")}
            fullWidth
            sx={{ marginBottom: 2 }}
            error={!!fieldErrors.departure}
            helperText={fieldErrors.departure}
          />

          <TextField
            label="Destination"
            value={newPosition.destination}
            onChange={(e) => handleFieldChange(e, "destination")}
            fullWidth
            sx={{ marginBottom: 2 }}
            error={!!fieldErrors.destination}
            helperText={fieldErrors.destination}
          />

          <TextField
            label="Distance"
            value={newPosition.distance}
            onChange={(e) => handleFieldChange(e, "distance")}
            fullWidth
            sx={{ marginBottom: 2 }}
            error={!!fieldErrors.distance}
            helperText={fieldErrors.distance}
            type="number"
          />

          <TextField
            label="Service Type"
            value={newPosition.type}
            onChange={(e) => handleFieldChange(e, "type")}
            fullWidth
            sx={{ marginBottom: 2 }}
            error={!!fieldErrors.type}
            helperText={fieldErrors.type}
          />

          <Button variant="contained" color="primary" onClick={handleAddNewPosition} sx={{ marginTop: 2 }}>
            Add Position
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setOpenAddPosition(false)}
            sx={{ marginTop: 2, marginLeft: 2 }}
          >
            Cancel
          </Button>
        </Box>
      )}

      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this position?</Typography>
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
    </Box>
  );
};

export default JobPositionsTab;
