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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { positionsData } from "../data/positions";
import { useDeviceStore } from "../../store/useDeviceStore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./availablePositionTable.scss";
import { Position } from "../../types/common";

const AvailablePositionTable: React.FC<AvailablePositionTableProps> = ({ onSelectJob }) => {
  const { isMobile } = useDeviceStore();

  return (
    <Box sx={{ marginBottom: 3 }}>
      <Typography variant="h6" component="h2">
        Lediga tjänster
      </Typography>
      {positionsData.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          Ingen ledig tjänst för tillfället, men du kan alltid skicka in en spontanansökan.
        </Typography>
      ) : isMobile ? (
        <Box>
          {positionsData.map((position) => (
            <Accordion key={position.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${position.id}-content`}
                id={`panel${position.id}-header`}
              >
                <Typography>{position.id}</Typography>
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
                    <ListItemText primary="Typ av tjänst" secondary={position.serviceType} />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <TableContainer component={Paper} data-testid="available-positions">
            <Table sx={{ minWidth: 650 }}>
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
                {positionsData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>Ingen ledig tjänst för tillfället.</TableCell>
                  </TableRow>
                ) : (
                  positionsData.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell>{position.id}</TableCell>
                      <TableCell>{position.departure || "Ingen tillgänglig"}</TableCell>
                      <TableCell>{position.destination || "Ingen tillgänglig"}</TableCell>
                      <TableCell>{position.distance || "Ingen tillgänglig"}</TableCell>
                      <TableCell>{position.serviceType}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default AvailablePositionTable;
