import React, { useState, useEffect, useNavigate } from 'react'; 
// import { useNavigate } from "react-router-dom/dist"
import { tokens } from "../../theme";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { mockQueue } from "../Data/mockData";
import Header from '../Header'
import { Routes, Route } from "react-router-dom";
import '../../App'

import { ColorModeContext, useMode } from '../../theme'
import { CssBaseline, ThemeProvider } from "@mui/material"
import Topbar from '../Global/topbar'
import Queue from "../Queue/Queue"
import LogHistory from "../Logbook/LogHistory"
import Analytics from "../Analytics/Analytics"
import Feedback from "../Feedback/Feedback"

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import FolderIcon from '@mui/icons-material/Folder';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import DataTable from '../../Charts/DataTable';
import StatBox from "../../Charts/StatBox";

const Dashboard = () => {  
  const [theme, colorMode] = useMode();
  const [setIsSidebar] = useState(true);
  const colors = tokens(theme.palette.mode);

  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex">
          <Box flex="1" display="flex" flexDirection="column">
            <Topbar setIsSidebar={setIsSidebar} />
            <Box m="20px">
              {/* HEADER */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="DASHBOARD" subtitle="Overview of your activities" />
                <Box>
                  <Button
                    sx={{
                      backgroundColor: colors.blueAccent[700],
                      color: colors.grey[100],
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "10px 20px",
                    }}
                  >
                    <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                    Download Reports
                  </Button>
                </Box>
              </Box>

              {/* GRID & CHARTS */}
              <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gap="20px"
              >
                {/* ROW 1 */}
                <Box
                  gridColumn="span 3"
                  backgroundColor={colors.primary[400]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="140px"
                >
                  <StatBox
                    title="100"
                    subtitle="Daily Visits"
                    progress="0.30"
                    increase="+5%"
                    icon={
                      <GroupIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                    }
                  />
                </Box>
                <Box
                  gridColumn="span 3"
                  backgroundColor={colors.primary[400]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="140px"
                >
                  <StatBox
                    title="150"
                    subtitle="Documents Requested"
                    progress="0.75"
                    increase="+14%"
                    icon={
                      <FolderIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                    }
                  />
                </Box>
                <Box
                  gridColumn="span 3"
                  backgroundColor={colors.primary[400]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="140px"
                >
                  <StatBox
                    title="1,225"
                    subtitle="Total Transactions"
                    progress="0.50"
                    increase="+21%"
                    icon={
                      <ReceiptIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                    }
                  />
                </Box>
                <Box
                  gridColumn="span 3"
                  backgroundColor={colors.primary[400]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="140px"
                >
                  <StatBox
                    title="50"
                    subtitle="Waiting in Queue"
                    progress="0.80"
                    increase="+43%"
                    icon={
                      <GroupAddIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
                    }
                  />
                </Box>

                {/* ROW 2 */}
                <Box
                  gridColumn="span 8"
                  gridRow="span 2"
                  backgroundColor={colors.primary[400]}
                  p="20px"
                >
                  <Box
                    p="0 30px"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="h5"
                      fontWeight="600"
                      color={colors.grey[100]}
                      textAlign="left"  // Ensure text is left-aligned

                    >
                      Log History
                    </Typography>
                    <IconButton>
                      <DownloadOutlinedIcon
                        sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                      />
                    </IconButton>
                  </Box>
                  <Box height="100%" mt="10px" overflow="auto">
                    <Typography
                      variant="body1"
                      color={colors.grey[100]}
                      sx={{ fontSize: "18px", textAlign: "left" }}
                    >
                      <DataTable />
                    </Typography>
                  </Box>
                </Box>

                <Box
                  gridColumn="span 4"
                  gridRow="span 2"
                  backgroundColor={colors.primary[400]}
                  overflow="auto"
                  sx={{ maxHeight: "400px", scrollbarWidth: "thin", scrollbarColor: `${colors.primary[500]} ${colors.grey[800]}` }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    borderBottom={`4px solid ${colors.primary[500]}`}
                    colors={colors.grey[100]}
                    p="15px"
                  >
                    <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                      Current Queue
                    </Typography>
                    <Box
                      maxHeight="100%"
                      overflow="auto"
                    >
                      {mockQueue.map((queue, i) => (
                        <Box
                          key={`${queue.queueId}-${i}`}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          borderBottom={`2px solid ${colors.primary[500]}`}
                          p="15px 0"
                        >
                          <Box>
                            <Typography
                              color={colors.greenAccent[500]}
                              variant="h5"
                              fontWeight="600"
                            >
                              {queue.queueId}
                            </Typography>
                            <Typography color={colors.grey[100]}>
                              {queue.user}
                            </Typography>
                          </Box>
                          <Typography color={colors.grey[100]}>{queue.date}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>

              </Box>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/queue" element={<Queue />} />
                <Route path="/logbook" element={<LogHistory />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/feedback" element={<Feedback />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Dashboard;
