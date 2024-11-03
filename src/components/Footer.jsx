import React from 'react';
import { Box, Typography, IconButton, Container } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', textAlign: 'center', width: '100%', position: 'relative', bottom: 0 }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 1 }}>
          <IconButton
            aria-label="LinkedIn"
            href="https://www.linkedin.com/in/annie-rumbles/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon fontSize="large" />
          </IconButton>
          <IconButton
            aria-label="GitHub"
            href="https://github.com/rumbelievable"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon fontSize="large" />
          </IconButton>
          <IconButton
            aria-label="Email"
            href="mailto:amrumbles@gmail.com"
          >
            <EmailIcon fontSize="large" />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          &copy; Rumbelievable {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;