import { Grid2, ImageListItem, ImageList, Typography, List, ListItem, Box, Divider, Paper } from '@mui/material';
import React from 'react';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CodeIcon from '@mui/icons-material/Code';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CreateIcon from '@mui/icons-material/Create';

const AboutMe = () => {
  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
    <Grid2 container spacing={5}>
      <Grid2 size={4}>
        <ImageList sx={{ width: "100%", height: "100%", borderRadius: 20 }} cols={1}>
          <ImageListItem>
            <img src="https://res.cloudinary.com/df4rizvgx/image/upload/v1730066308/IMG_2975_2_plnsud_raz2ve.jpg" loading="lazy" alt="me" />
          </ImageListItem>
        </ImageList>
      </Grid2>
      <Grid2 size={7} sx={{ ml: 2 }}>
      <Paper sx={{ lineHeight: '60px' }} elevation={8}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', pl: 3, pt: 2, pb: 2 }}>About Me</Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, pl: 3, pb: 3 }}>
          Hi, I'm Annie!
        </Typography>
        </Paper>
        <Box sx={{ p: 3 }}>
        <Typography>I made this website for a few reasons:</Typography>
        <List>
          <ListItem><LocalAtmIcon />&nbsp;&nbsp;I wanted to save some money and avoid a website builder</ListItem>
          <ListItem><CodeIcon />&nbsp;I wanted to learn to build my own website</ListItem>
          <ListItem><CameraAltIcon />&nbsp;&nbsp; I wanted my photos to still exist somewhere</ListItem>
          <ListItem><CreateIcon />&nbsp;&nbsp; I wanted a place to put some thoughts... whether that's a good idea is yet to be seen *sweat emoji*</ListItem>
        </List>
        <Divider />
        <Typography variant="body1" sx={{ lineHeight: "24px", whiteSpace: 'pre-line' }}>
          {`\nI was born in England and moved to Boulder, Colorado when I was 5 years old. With that came a pride in being both English and American, and neither!
          \nMy days consist of some amalgamation of watching football (soccer), both womens and mens; taking my two wonderful dogs, Tetley and Lupine, on a walk or hike with my lovely partner; reading lots and lots of books; trying my hand at woodworking; listening to podcasts and other audiobooks trying to learn some stuff; having therapy trying to learn about myself.
          \nI'm not sure what life is all about, but so far it seems like community, creativity, and experiencing things that allow you to feel are the current front-runners.
          \nThanks for coming!`}
        </Typography>
        </Box>
      </Grid2>
    </Grid2>
    </Box>
  );
};

export default AboutMe;