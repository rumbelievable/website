import React from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Card,
  CardMedia,
  Grid2,
  Link,
  Fab
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ScrollTop } from './20240513';
import CommentSection from '../../components/CommentSection';

function BlogPost(props) {
  return (
    <>
      <React.Fragment>
        <Container maxWidth="md">
          <Box component="article" sx={{ pt: 5 }}>
            <Typography variant="h2" gutterBottom>
              Woodworking my way downtown
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              May 17, 2024
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant='body1' gutterBottom component="div">
              About a year ago I decided I wanted to build something with my hands, for fun, and for when the Grid2 goes down and I have to fell trees and build shelter. I'm kidding mostly!
              Anyway, I found a <Link href="https://www.woodworksstudio.com/">woodworking class</Link> nearby-ish and signed up for the bookcase class. And I went and built a bookcase and learned all about
            </Typography>

            <List>
              {[
                "Lumber, S3S, and how to avoid the ~twist~",
                "Miter saws and crosscuts",
                "Jointers and the importance of a straight edge (me in highschool)",
                "Table saws and robotically avoiding a disaster",
                "The ease of planers",
                "Dados and rabbets! Dattos and rabbits! Doodoos and doodahs!",
                "Pockets holes and an intro to jigs and all their wonder",
                "Wood glue, wood glue everywhere!",
                "Edge jointing, I think that's what it's called :)",
                "The joy and wonder of a router and how I called it a beveller for… too long",
                "And much, much more!"
              ].map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <ArrowForwardIcon />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>

            <Typography variant='body1' gutterBottom component="div">
              And at the end, I had a functional bookcase, tadaaaa, made of poplar wood.
            </Typography>

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ width: '100%', pt: 2 }}
            >
              <Card sx={{ mb: 2, maxWidth: '40%' }}>
                <CardMedia
                  component="img"
                  image="https://res.cloudinary.com/df4rizvgx/image/upload/v1716000411/blog_images/IMG_2976_ujavcr.jpg"
                  alt="Bookcase"
                  sx={{ width: '100%', height: 'auto' }}
                />
              </Card>
            </Box>

            <Typography variant='body1' gutterBottom component="div">
              I painted it a sage green because my partner and I love us a sage green!! I'll go ahead and ignore any scoffs about painting wood.
            </Typography>

            <Typography variant='body1' gutterBottom component="div">
              <Box component="span" fontWeight="bold" fontStyle="italic">AND THEN.</Box>
            </Typography>

            <Typography variant='body1' gutterBottom component="div">
              I signed up for the intermediate class peeps!!! I won't walk through the rigamarole that was me figuring out how to even approach this class. But fast-forward, and I found <Link href="https://spencleydesignco.com/collections/furniture-plans/products/cody-coffee-table-plans">some plans for a coffee table</Link> that I wanted to make and went forth.
            </Typography>
          </Box>
        </Container>
        <Container maxWidth="lg">
          <Grid2 container spacing={2} justifyContent="center" sx={{ pt: 2, pb: 2 }}>
            {[
              "https://res.cloudinary.com/df4rizvgx/image/upload/v1716000410/blog_images/IMG_3622_lv65cy.jpg",
              "https://res.cloudinary.com/df4rizvgx/image/upload/v1716000411/blog_images/72875288172__343E8C8B-49CB-4CB4-BBB6-F234CA318008-preview_xaqdbg.jpg"
            ].map((img, index) => (
              <Grid2 xs={12} sm={6} key={index}>
                <Card sx={{ maxWidth: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    image={img}
                    alt={`Coffee table ${index + 1}`}
                    sx={{ width: '100%', height: 'auto', maxWidth: '350px', objectFit: 'contain' }}
                  />
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Container>
        <Container maxWidth="md">
          <Box component="article">
            <Typography variant='body1' gutterBottom component="div">
              And to say this is my pride and joy… is true. I love this thing. I could wax poetic about it forever, but here's a pic. My baby.
            </Typography>

            <Typography variant='body1' gutterBottom component="div">
              I caught the bug, I love making things from wood. I'm currently building a <Link href="https://www.modernbuilds.com/diy-dog-bed">bed frame for a dog bed</Link> because that is who. I. am. Stay tuned!
            </Typography>

            <Typography variant='body1' gutterBottom component="div">
              P.S. A lil side project to hold my morning cups of tea while I read!!
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ width: '100%', pt: 2 }}
            >
              <Card sx={{ mb: 2, maxWidth: '40%' }}>
                <CardMedia
                  component="img"
                  image="https://res.cloudinary.com/df4rizvgx/image/upload/v1716000411/blog_images/IMG_4355_pnugwk.jpg"
                  alt="Tea holder"
                  sx={{ width: '100%', height: 'auto' }}
                />
              </Card>
            </Box>
          </Box>
          <CommentSection />
        </Container>
        <ScrollTop {...props}>
          <Fab size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </React.Fragment>
    </>
  );
};

export default BlogPost;