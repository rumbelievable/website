import React from 'react';
import {
  Container,
  Typography,
  Box,
  Divider,
} from '@mui/material';

const Home = () => {

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        padding: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <img
            src="https://res.cloudinary.com/df4rizvgx/image/upload/v1716646449/RUMBELIEVABLE_copy_vk75vr.png"
            alt="Rumbelievable"
            style={{ width: '100%', maxWidth: 570, height: 'auto' }}
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" component="p" gutterBottom>
            Home to my photography, some words, and... anything else I can come up with. 
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            I hope you enjoy, and if you don't, please don't tell me – I'm really sensitive.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;