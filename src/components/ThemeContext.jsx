import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from '../theme';


const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? JSON.parse(savedTheme) : false;
      });
    
      useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(isDarkMode));
      }, [isDarkMode]);
    
      const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
      };
    
      // Use useMemo to prevent unnecessary theme recreations
      const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
      <CssBaseline /> {/* This component normalizes styles and applies the theme's background color */}
      {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);