import React, { useState } from "react";
import { Tab, Tabs, Box, Typography } from "@mui/material";

import ClientsMessagesTab from "../ClientsMessagesTab/ClientsMessagesTab";
import ApplicationsMessagesTab from "../ApplicationsMessagesTab/ApplicationsMessagesTab";
import JobPositionsTab from "../JobPositionsTab/JobPositionsTab";
import AdminsTab from "../AdminsTab/AdminsTab";

const AdminPageTabs: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Tabs value={value} onChange={handleChange} aria-label="Admin Page Tabs">
        <Tab label="Client Messages" />
        <Tab label="Application Messages" />
        <Tab label="Job Positions" />
        <Tab label="Admins" />
      </Tabs>

      <Box sx={{ padding: 3 }}>
        {value === 0 && <ClientsMessagesTab />}
        {value === 1 && <ApplicationsMessagesTab />}
        {value === 2 && <JobPositionsTab />}
        {value === 3 && <AdminsTab />}
      </Box>
    </Box>
  );
};

export default AdminPageTabs;
