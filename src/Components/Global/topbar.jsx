import React, { useState } from 'react';
import { Box, IconButton, useTheme, Typography, Menu, MenuItem } from '@mui/material';
import { useContext } from 'react';
import { ColorModeContext, tokens } from '../../theme';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { Link } from 'react-router-dom';

import logoLight from '../../Assets/logo-light.png';
import logoDark from '../../Assets/logo-dark.png';

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Remove token from sessionStorage
    handleClose(); // Close the menu
    window.location.href = '/'; // Redirect to the login page
  };

  // Example user data (replace with actual logged-in user data)
  const userData = {
    name: 'John Doe',
    position: 'Admin',
    email: 'john.doe@example.com'
  };

  return (
    <Box display='flex' justifyContent='space-between' alignItems='center' p={2}>
      {/* Logo */}
      <Box display='flex' alignItems='center'>
        <Box component="img" src={theme.palette.mode === 'dark' ? logoDark : logoLight} alt="Logo" sx={{ height: '40px', width: 'auto', mr: 2 }} />
      </Box>

      {/* Center texts */}
      <Box display='flex' justifyContent='center' alignItems='center' flexGrow={1}>
        <Typography variant='h6' sx={{ mx: 2 }}>
          <Link to='/queue' style={{ textDecoration: 'none', color: 'inherit' }}>QUEUE</Link>
        </Typography>
        <Typography variant='h6' sx={{ mx: 2 }}>
          <Link to='/logbook' style={{ textDecoration: 'none', color: 'inherit' }}>LOGBOOK</Link>
        </Typography>
        <Typography variant='h6' sx={{ mx: 2 }}>
          <Link to='/analytics' style={{ textDecoration: 'none', color: 'inherit' }}>ANALYTICS</Link>
        </Typography>
        <Typography variant='h6' sx={{ mx: 2 }}>
          <Link to='/feedback' style={{ textDecoration: 'none', color: 'inherit' }}>FEEDBACK</Link>
        </Typography>
      </Box>

      {/* Icons */}
      <Box display='flex' alignItems='center'>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleClick}>
          <PersonOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>{userData.name}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>{userData.position}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>{userData.email}</Typography>
            <Box display="flex" alignItems="center">
              <IconButton>
                <SettingsOutlinedIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={handleLogout}>
                Logout
              </IconButton>
            </Box>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
