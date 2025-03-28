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

const JobPositionsTab: React.FC = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<number | null>(null);
  const [openAddPosition, setOpenAddPosition] = useState(false);
  const [newPosition, setNewPosition] = useState({
    departure: "",
    destination: "",
    distance: "",
    type: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    departure: "",
    destination: "",
    distance: "",
    type: "",
  });
  const { jobPositions, loading, error, setJobPositions, addJobPosition, deleteJobPosition } = useJobPositions();

  const handleDeletePosition = (index: number) => {
    setPositionToDelete(index);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (positionToDelete !== null) {
      const positionToDeleteObj = jobPositions[positionToDelete];
      const { positionId, createdAt } = positionToDeleteObj;
      await deleteJobPosition(positionId, createdAt);
      setOpenDeleteDialog(false);
      setPositionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setPositionToDelete(null);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const { value } = e.target;
    setFieldErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    setNewPosition((prevPosition) => ({
      ...prevPosition,
      [field]: value,
    }));
  };

  const validatePositionData = (data: typeof newPosition) => {
    const errors: { [key: string]: string } = {};
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
    await addJobPosition(newPosition);
    setNewPosition({ departure: "", destination: "", distance: "", type: "" });
    setOpenAddPosition(false);
  };

  if (loading) {
    return (
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6" component="h2">
          Loading...
        </Typography>
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
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${position.positionId || index}-content`}
            id={`panel${position.positionId || index}-header`}
          >
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
          <Button variant="outlined" color="error" onClick={() => handleDeletePosition(index)} sx={{ marginTop: 1 }}>
            Delete Position
          </Button>
        </Accordion>
      ))}

      <Button variant="contained" color="primary" onClick={() => setOpenAddPosition(true)} sx={{ marginTop: 2 }}>
        + Add New Position
      </Button>

      {openAddPosition && (
        <Box sx={{ marginTop: 2, padding: 2, border: "1px solid #ddd" }}>
          <Typography variant="h6">Add New Position</Typography>

          <TextField
            label="Departure"
            value={newPosition.departure}
            onChange={(e) => handleFieldChange(e, 'departure')}
            fullWidth
            sx={{ marginBottom: 2 }}
            error={!!fieldErrors.departure}
            helperText={fieldErrors.departure}
          />

          <TextField
            label="Destination"
            value={newPosition.destination}
            onChange={(e) => handleFieldChange(e, 'destination')}
            fullWidth
            sx={{ marginBottom: 2 }}
            error={!!fieldErrors.destination}
            helperText={fieldErrors.destination}
          />

          <TextField
            label="Distance"
            value={newPosition.distance}
            onChange={(e) => handleFieldChange(e, 'distance')}
            fullWidth
            sx={{ marginBottom: 2 }}
            error={!!fieldErrors.distance}
            helperText={fieldErrors.distance}
            type="number"
          />

          <TextField
            label="Service Type"
            value={newPosition.type}
            onChange={(e) => handleFieldChange(e, 'type')}
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
