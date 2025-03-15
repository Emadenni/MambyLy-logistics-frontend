// src/components/AvailablePositionTable/AvailablePositionTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { positionsData } from "../data/positions";
import "./availablePositionTable.scss";
import { Position } from "../../types/common";

const AvailablePositionTable: React.FC<AvailablePositionTableProps> = ({ onSelectJob }) => {
  return (
    <Box sx={{ marginBottom: 3 }}>
      <Typography variant="h6" component="h2">
        Lediga tjänster
      </Typography>
      {positionsData.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          Ingen ledig tjänst för tillfället, men du kan alltid skicka in en spontanansökan.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Avgång</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Antal km</TableCell>
                <TableCell>Typ av tjänst</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positionsData.map((position) => (
                <TableRow key={position.id}>
                  <TableCell>{position.id}</TableCell>
                  <TableCell>{position.departure || "Ingen tillgänglig"}</TableCell>
                  <TableCell>{position.destination || "Ingen tillgänglig"}</TableCell>
                  <TableCell>{position.distance || "Ingen tillgänglig"}</TableCell>
                  <TableCell>{position.serviceType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AvailablePositionTable;
