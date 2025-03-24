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
  const { jobPositions, loading, error, setJobPositions, addJobPosition, fieldErrors } = useJobPositions();

  const handleDeletePosition = (index: number) => {
    setPositionToDelete(index);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (positionToDelete !== null) {
      const newPositions = [...jobPositions];
      newPositions.splice(positionToDelete, 1);
      setJobPositions(newPositions);
      setOpenDeleteDialog(false);
      setPositionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setPositionToDelete(null);
  };

  const handleAddNewPosition = async () => {
    await addJobPosition(newPosition);

    if (Object.keys(fieldErrors).length > 0) return;

    setNewPosition({ departure: "", destination: "", distance: "", type: "" });
    setOpenAddPosition(false);
  };

  if (loading) {
    return (
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6" component="h2">
          Laddar lediga tjänster...
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
            onChange={(e) => setNewPosition({ ...newPosition, departure: e.target.value })}
            fullWidth
            sx={{ marginBottom: 2 }}
            error={!!fieldErrors.departure}
            helperText={fieldErrors.departure}
          />

          <TextField
            label="Destination"
            value={newPosition.destination}
            onChange={(e) => setNewPosition({ ...newPosition, destination: e.target.value })}
            fullWidth
            sx={{ marginBottom: 2 }}
            error={!!fieldErrors.destination}
            helperText={fieldErrors.destination}
          />

          <TextField
            label="Distance"
            value={newPosition.distance}
            onChange={(e) => setNewPosition({ ...newPosition, distance: e.target.value })}
            fullWidth
            sx={{ marginBottom: 2 }}
            error={!!fieldErrors.distance}
            helperText={fieldErrors.distance}
          />

          <TextField
            label="Service Type"
            value={newPosition.type}
            onChange={(e) => setNewPosition({ ...newPosition, type: e.target.value })}
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
