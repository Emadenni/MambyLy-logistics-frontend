/* import React from "react";
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
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useDeviceStore } from "../../store/useDeviceStore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AvailablePositionTableProps, JobPosition } from "../../types/common";
import useJobPositions from "../../hooks/useJobPositions";
import "./availablePositionTable.scss";
import { formatDate } from "../../utils/dateUtils";

const handleCopy = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Copied!");
    })
    .catch((err) => {
      console.error("Errore durante la copia: ", err);
    });
};

const AvailablePositionTable: React.FC<AvailablePositionTableProps> = ({ onSelectJob }) => {
  const { isMobile } = useDeviceStore();
  const { jobPositions, loading, error } = useJobPositions();

  if (loading) {
    return (
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6" component="h2">
          Laddar lediga tjänster...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6" color="error">
          Ett fel uppstod vid hämtning av tjänster: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ marginBottom: 3 }}>
      <Typography variant="h6" component="h2">
        Lediga tjänster
      </Typography>
      {jobPositions.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          Ingen ledig tjänst för tillfället, men du kan alltid skicka in en spontanansökan.
        </Typography>
      ) : isMobile ? (
        <Box>
          {jobPositions.map((position: JobPosition) => (
            <Accordion key={position.positionId}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${position.positionId}-content`}
                id={`panel${position.positionId}-header`}
              >
                <Typography>{position.positionId}</Typography>
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
                    <ListItemText primary="Typ av tjänst" secondary={position.type} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Created At" secondary={formatDate(position.createdAt)} />
                  </ListItem>
                  <ListItem>
                    <IconButton
                      aria-label="copy id"
                      onClick={() => handleCopy(position.positionId)}
                      size="small"
                    >
                      <ContentCopyIcon />
                    </IconButton>
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
                  <TableCell>Copy Id</TableCell>
                  <TableCell>Created At</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {jobPositions.length === 0 ? (
                   <TableRow>
                   <TableCell colSpan={7}>Ingen ledig tjänst för tillfället.</TableCell>
                 </TableRow>
               ) : (
                 jobPositions.map((position: JobPosition) => (
                   <TableRow key={position.positionId}>
                     <TableCell>{position.positionId}</TableCell>
                     <TableCell>{position.departure || "Ingen tillgänglig"}</TableCell>
                     <TableCell>{position.destination || "Ingen tillgänglig"}</TableCell>
                     <TableCell>{position.distance || "Ingen tillgänglig"}</TableCell>
                     <TableCell>{position.type}</TableCell>
                     <TableCell>
                       <IconButton
                         aria-label="copy"
                         onClick={() => handleCopy(position.positionId)}
                         size="small"
                       >
                         <ContentCopyIcon />
                       </IconButton>
                     </TableCell>
                     <TableCell>{formatDate(position.createdAt)}</TableCell>
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
 */