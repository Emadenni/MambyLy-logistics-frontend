import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Avatar, Link } from "@mui/material";
import { teamMembersData } from "../data/teamMembers";
import SocialBox from "../SocialBox/SocialBox";
import "./contactsListBox.scss";
import { TeamMember } from "../../types/common";

const ContactsListBox = () => {
  return (
    <Box className="contact-box">
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          "@media (min-width: 2560px)": {
            fontSize: "2.6rem",
            padding: "3rem",
          },
          "@media (min-width: 1920px)": {
            fontSize: "2.2rem",
            padding: "3rem",
          },
        }}
      >
        Våra kontakter
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary={
              <Typography
                sx={{
                  "@media (min-width: 1920px)": {
                    fontSize: "2rem",
                  },
                }}
              >
                Email
              </Typography>
            }
            secondary={
              <Typography
                variant="h6"
                className="list_items"
                sx={{
                  "@media (min-width: 2560px)": {
                    fontSize: "2rem",
                  },
                  "@media (min-width: 1920px)": {
                    fontSize: "1.6rem",
                  },
                }}
              >
                <Link href="mailto:info@mambyly.se" style={{ textDecoration: "none", color: "inherit" }}>
                  info@mambylysolutions.se
                </Link>
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Typography
                sx={{
                  "@media (min-width: 1920px)": {
                    fontSize: "2rem",
                  },
                }}
              >
                Telefon
              </Typography>
            }
            secondary={
              <Typography
                variant="h6"
                className="list_items"
                sx={{
                  "@media (min-width: 2560px)": {
                    fontSize: "2rem",
                  },
                  "@media (min-width: 1920px)": {
                    fontSize: "1.6rem",
                  },
                }}
              >
                <Link href="tel:+46722116422" style={{ textDecoration: "none", color: "inherit" }}>
                  +46 72 211 64 22
                </Link>
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Typography
                sx={{
                  "@media (min-width: 1920px)": {
                    fontSize: "2rem",
                  },
                }}
              >
                Vi är baserade i
              </Typography>
            }
            secondary={
              <Typography
                variant="h6"
                className="list_items"
                sx={{
                  "@media (min-width: 2560px)": {
                    fontSize: "2rem",
                  },
                }}
              >
                Björkliden, Linköping SE
              </Typography>
            }
          />
        </ListItem>
      </List>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          "@media (min-width: 2560px)": {
            fontSize: "2rem",
          },
          "@media (min-width: 1920px)": {
            fontSize: "1.6rem",
          },
        }}
      >
        Följ oss på sociala medier
      </Typography>
      <SocialBox />
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          "@media (min-width: 2560px)": {
            fontSize: "2rem",
          },
          "@media (min-width: 1920px)": {
            fontSize: "1.6rem",
          },
        }}
      >
        För specifika frågor, kontakta våra nyckelpersoner
      </Typography>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={25}
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
              maxWidth: 350,
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
                objectFit: "cover",
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                "@media (min-width: 2560px)": {
                  fontSize: "2rem",
                },
                "@media (min-width: 1920px)": {
                  fontSize: "1.6rem",
                },
              }}
            >
              {member.name}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                "@media (min-width: 2560px)": {
                  fontSize: "2rem",
                },
                "@media (min-width: 1920px)": {
                  fontSize: "1.6rem",
                },
                
              }}
            >
              {member.role}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                "@media (min-width: 2560px)": {
                  fontSize: "2rem",
                },
                "@media (min-width: 1920px)": {
                  fontSize: "1.6rem",
                },
                whiteSpace: "nowrap",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <a href={`mailto:${member.email}`} style={{ textDecoration: "none", color: "inherit" }}>
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
