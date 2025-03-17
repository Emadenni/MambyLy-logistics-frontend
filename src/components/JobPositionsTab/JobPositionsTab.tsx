import React, { useState } from "react";
import { Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { positionsData } from "../data/positions";

const JobPositionsTab: React.FC = () => {
  const [positions, setPositions] = useState(positionsData);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<number | null>(null);
  const [editingPositionIndex, setEditingPositionIndex] = useState<number | null>(null);
  const [editedPosition, setEditedPosition] = useState<any | null>(null);
  const [openAddPosition, setOpenAddPosition] = useState(false);  // Stato per il nuovo modulo
  const [newPosition, setNewPosition] = useState({
    departure: "",
    destination: "",
    distance: "",
    serviceType: "",
  });

  const handleDeletePosition = (index: number) => {
    setPositionToDelete(index);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (positionToDelete !== null) {
      const newPositions = [...positions];
      newPositions.splice(positionToDelete, 1);
      setPositions(newPositions);
      setOpenDeleteDialog(false);
      setPositionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setPositionToDelete(null);
  };

  const handleEditPosition = (index: number) => {
    setEditingPositionIndex(index);
    setEditedPosition({ ...positions[index] });
  };

  const handleSaveEdit = () => {
    if (editingPositionIndex !== null && editedPosition) {
      const newPositions = [...positions];
      newPositions[editingPositionIndex] = editedPosition;
      setPositions(newPositions);
      setEditingPositionIndex(null);
      setEditedPosition(null);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (editedPosition) {
      setEditedPosition({
        ...editedPosition,
        [field]: event.target.value,
      });
    } else {
      setNewPosition({
        ...newPosition,
        [field]: event.target.value,
      });
    }
  };

  const handleAddNewPosition = () => {
    setPositions([...positions, newPosition]);
    setOpenAddPosition(false);
    setNewPosition({ departure: "", destination: "", distance: "", serviceType: "" });
  };

  return (
    <Box sx={{ padding: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', marginBottom: 2 }}>
                Job Positions
              </Typography>
      {positions.map((position, index) => (
        <Box key={index} sx={{ marginBottom: 2, borderBottom: "1px solid #ddd", paddingBottom: 2 }}>
          {editingPositionIndex === index ? (
            <>
              <TextField
                label="Departure"
                value={editedPosition.departure}
                onChange={(e) => handleChange(e, "departure")}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Destination"
                value={editedPosition.destination}
                onChange={(e) => handleChange(e, "destination")}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Distance"
                value={editedPosition.distance}
                onChange={(e) => handleChange(e, "distance")}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Service Type"
                value={editedPosition.serviceType}
                onChange={(e) => handleChange(e, "serviceType")}
                fullWidth
                sx={{ marginBottom: 2 }}
              />

              <Button
                variant="outlined"
                color="primary"
                onClick={handleSaveEdit}
                sx={{ marginTop: 1 }}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Typography><strong>Departure:</strong> {position.departure}</Typography>
              <Typography><strong>Destination:</strong> {position.destination}</Typography>
              <Typography><strong>Distance:</strong> {position.distance}</Typography>
              <Typography><strong>Service Type:</strong> {position.serviceType}</Typography>

              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleEditPosition(index)}
                sx={{ marginTop: 1 }}
              >
                Edit Position
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeletePosition(index)}
                sx={{ marginTop: 1, marginLeft: 2 }}
              >
                Delete Position
              </Button>
            </>
          )}
        </Box>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddPosition(true)}
        sx={{ marginTop: 2 }}
      >
        + Add New Position
      </Button>

      {openAddPosition && (
        <Box sx={{ marginTop: 2, padding: 2, border: "1px solid #ddd" }}>
          <Typography variant="h6">Add New Position</Typography>
          <TextField
            label="Departure"
            value={newPosition.departure}
            onChange={(e) => handleChange(e, "departure")}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Destination"
            value={newPosition.destination}
            onChange={(e) => handleChange(e, "destination")}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Distance"
            value={newPosition.distance}
            onChange={(e) => handleChange(e, "distance")}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Service Type"
            value={newPosition.serviceType}
            onChange={(e) => handleChange(e, "serviceType")}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNewPosition}
            sx={{ marginTop: 2 }}
          >
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
