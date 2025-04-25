import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Avatar, Link } from "@mui/material";
import { teamMembersData } from "../data/teamMembers";
import SocialBox from "../SocialBox/SocialBox";
import { Email, Phone, LocationOn } from "@mui/icons-material";
import "./contactsListBox.scss";

const ContactsListBox = () => {
  return (
    <Box className="contact-box">
      <div className="contacts_wrapper">
        <Typography variant="h5" gutterBottom className="section-title">
          Våra kontakter
        </Typography>
        <List>
          <ListItem className="contact-item">
            <ListItemText
              primary={<Email className="contact-icon" />}
              secondary={
                <Typography variant="body1">
                  <Link href="mailto:info@mambyly.se" className="contact-link">
                    info@mambylysolutions.se
                  </Link>
                </Typography>
              }
            />
          </ListItem>
          <ListItem className="contact-item">
            <ListItemText
              primary={<Phone className="contact-icon" />}
              secondary={
                <Typography variant="body1">
                  <Link href="tel:+46722116422" className="contact-link">
                    +46 72 211 64 22
                  </Link>
                </Typography>
              }
            />
          </ListItem>
          <ListItem className="contact-item">
            <ListItemText
              primary={<LocationOn className="contact-icon" />}
              secondary={<Typography variant="body1">Björkliden, Linköping SE</Typography>}
            />
          </ListItem>
        </List>
      </div>
      <div className="special_contacts_wrapper">
        {teamMembersData.map((member, index) => (
          <Box
            key={index}
            textAlign="center"
            sx={{
              width: "100%",
              sm: "33%",
              maxWidth: 350,
            }}
            className="team-member"
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
                objectFit: "cover",
              }}
            />
            <Typography variant="subtitle1" className="team-member-name">
              {member.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" className="team-member-role">
              {member.role}
            </Typography>
            <Typography variant="body2" className="team-member-email">
              <a href={`mailto:${member.email}`} className="contact-link">
                {member.email}
              </a>
            </Typography>
          </Box>
        ))}
      </div>

      <Typography variant="h5" className="section-title">
        Följ oss på sociala medier
      </Typography>
      <SocialBox />
      <div>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          flexDirection={{ xs: "column", sm: "row" }}
          data-testid="contacts-list-box"
        ></Box>
      </div>
    </Box>
  );
};

export default ContactsListBox;
