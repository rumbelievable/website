import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid2,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 300,
  height: 300,
  margin: 10,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 24,
  '&:hover': {
    outline: `solid 3px ${theme.palette.mode === 'light' ? '#212529' : '#dee2e6'}`,
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius,
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: 33,
  fontWeight: 'bold',
  color: '#dee2e6',
  opacity: 1,
  transition: 'opacity 0.3s ease-in-out',
}));

const albums = [
  { title: 'Landscapes', image: 'path/to/landscape-image.jpg', link: '/albums/landscapes' },
  { title: 'Mountains', image: 'path/to/mountain-image.jpg', link: '/albums/mountains' },
  { title: 'Night Sky', image: 'path/to/night-sky-image.jpg', link: '/albums/night-sky' },
  { title: 'Panoramas', image: 'path/to/panorama-image.jpg', link: '/albums/panoramas' },
  { title: 'Reflections', image: 'path/to/reflection-image.jpg', link: '/albums/reflections' },
  { title: 'Wildlife', image: 'path/to/wildlife-image.jpg', link: '/albums/wildlife' },
];

const Photography = () => {

  return (
    <Container maxWidth="lg">

      <Grid2 container justifyContent="center" sx={{ mt: 4 }}>
        {albums.map((album, index) => (
          <Grid2 item key={index}>
            <StyledBox component={Link} to={album.link}>
              <img src={album.image} alt={album.title} />
              <StyledTitle>{album.title}</StyledTitle>
            </StyledBox>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

export default Photography;