import React from 'react';
import { Fab } from '@mui/material';
import { useTheme } from './ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <Fab
      color="primary"
      onClick={toggleTheme}
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        opacity: "60%"
      }}
    >
      {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </Fab>
  );
};

export default ThemeToggle;