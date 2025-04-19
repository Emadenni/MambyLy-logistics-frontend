import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Avatar, Link } from "@mui/material";
import { teamMembersData } from "../data/teamMembers";
import SocialBox from "../SocialBox/SocialBox";
import "./contactsListBox.scss";
import { TeamMember } from "../../types/common";

const ContactsListBox = () => {
  return (
    <Box className="contact-box">
      <Typography variant="h5" gutterBottom>
        Våra kontakter
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Email"
            secondary={
              <Link href="mailto:info@mambyly.se" style={{ textDecoration: "none", color: "inherit" }}>
                info@mambyly.se
              </Link>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Telefon"
            secondary={
              <Link href="tel:+46722116422" style={{ textDecoration: "none", color: "inherit" }}>
                +46 72 211 64 22
              </Link>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Vi är baserade i" secondary="Björkliden, Linköping SE" />
        </ListItem>
      </List>
      <Typography variant="h6" gutterBottom>
        Följ oss på sociala medier
      </Typography>
      <SocialBox />
      <Typography variant="h6" gutterBottom>
        För specifika frågor, kontakta våra nyckelpersoner
      </Typography>
      
      
      <Box
  display="flex"
  justifyContent="center"
  alignItems="center"
  gap={10}
  flexDirection={{ xs: "column", sm: "row" }} 
  data-testid="contacts-list-box"
>
  {teamMembersData.map((member, index) => (
    <Box
      key={index}
      textAlign="center"
      sx={{
        width: "100%", 
        sm: "33%", 
        maxWidth: 350
      }}
    >
      <Avatar
  alt={member.name}
  src={member.imageUrl}
  sx={{
    width: 120,
    height: 120,
    margin: "0 auto",
    borderRadius: "50%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    objectFit: "cover", // <-- questa è la chiave
  }}
/>
      <Typography variant="subtitle1">{member.name}</Typography>
      <Typography variant="body2" color="textSecondary">
        {member.role}
      </Typography>
      <Typography variant="body2">
        <a
          href={`mailto:${member.email}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {member.email}
        </a>
      </Typography>
    </Box>
  ))}
</Box>

    </Box>
  );
};

export default ContactsListBox;
