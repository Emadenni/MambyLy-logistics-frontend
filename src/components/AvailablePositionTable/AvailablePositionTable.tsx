import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";
import "./availablePositionTable.scss";
import { Position } from "../../types/common";

const AvailablePositionTable: React.FC<AvailablePositionTableProps> = ({ onSelectJob }) => {
  const positions: Position[] = [
    { id: "position1", departure: "Stockholm", destination: "Göteborg", distance: "500 km", serviceType: "Transport" },
    { id: "position2", departure: "Malmö", destination: "Lund", distance: "50 km", serviceType: "Transport" },
    { id: "position3", departure: "Uppsala", destination: "Östersund", distance: "600 km", serviceType: "Transport" },
  
  ];

  return (
    <Box sx={{ marginBottom: 3 }}>
      <h2>Lediga tjänster</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell> {/* Colonna per l'ID */}
              <TableCell>Avgång</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Antal km</TableCell>
              <TableCell>Typ av tjänst</TableCell>
              <TableCell>Välj</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {positions.map((position) => (
              <TableRow key={position.id}>
                <TableCell>{position.id}</TableCell> {/* Visualizza l'ID della posizione */}
                <TableCell>{position.departure || "Ingen tillgänglig"}</TableCell>
                <TableCell>{position.destination || "Ingen tillgänglig"}</TableCell>
                <TableCell>{position.distance || "Ingen tillgänglig"}</TableCell>
                <TableCell>{position.serviceType}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => onSelectJob(position.id)}>
                    Välj
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AvailablePositionTable;
