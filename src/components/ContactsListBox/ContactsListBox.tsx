import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Avatar, Grid, Link } from "@mui/material";
import { teamMembersData } from "../data/teamMembers";
import SocialBox from "../SocialBox/SocialBox";
import "./contactsListBox.scss";
import { TeamMember } from "../../types/common";

const ContactsListBox = () => {
  return (
    <Box className="contact-box" >
      <Typography variant="h5" gutterBottom>
        Våra kontakter
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Email" secondary="info@mambyly.se" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Telefon" secondary="-46 72 211 64 22" />
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
      <Grid container spacing={3} data-testid="contacts-list-box">
        {teamMembersData.map((member, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar alt={member.name} src={member.imageUrl} sx={{ width: 100, height: 100, margin: "0 auto" }} />
              <Typography variant="subtitle1">{member.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {member.role}
              </Typography>
              <Typography variant="body2">
                <a href={`mailto:${member.email}`} style={{ textDecoration: "none" }}>
                  {member.email}
                </a>
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ContactsListBox;
