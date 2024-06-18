import { useState } from 'react';
import { Box, IconButton, useTheme, Typography, Fade } from '@mui/material';
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
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
