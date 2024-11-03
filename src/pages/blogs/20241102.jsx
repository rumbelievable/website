import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Fab,
  Paper,
  Divider
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ScrollTop } from './20240513';

function BlogPost(props) {
  return (
    <React.Fragment>
      <Container maxWidth="md">
        <Box component="article" sx={{ pt: 5 }}>
          <Typography variant="h2" gutterBottom>
            Oops, I did it again
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            November 2, 2024
          </Typography>

          <Typography variant='body1' gutterBottom component="div">
            So I re-made my website. Again.
          </Typography>
          <Typography variant='body1' gutterBottom component="div">
            I did a hackathon project at work and my team used React and Material UI and I was like oh ok this is cool! So like the nerd I am, I updated my website to use it too, ¯\_(ツ)_/¯
          </Typography>
          <Typography variant='body1' gutterBottom component="div">
            But now that I think about it, there are probably only a few people who saw the old one, so for everyone else this makes no sense. My bad!
          </Typography>
          <Typography variant='h5' gutterBottom component="div" sx={{ mt: 3 }}>
            Homework
          </Typography>
          <Typography variant='body1' gutterBottom component="div">
            I recently finished a book called <i>The Naked Mind</i>, by Annie Grace (I'll always remember this authors name since it's my name, and my BFFs name).
            The entire name of the book is <Link style={{ fontStyle: "italic", textDecoration: 'none' }} href="https://www.goodreads.com/book/show/27202127-this-naked-mind">The Naked Mind: Control Alcohol, Find Freedom, Discover Happiness & Change Your Life</Link>,
            and Grace suggested the reader write down their story about drinking. I think that might be a good idea for me. To be totally honest,
            I've put this off by refactoring my website LOL. It's not comfortable for me to write a blog, and it is definitely not comfortable for me to write
            about something like drinking. But We Can Do Hard Things, so here goes a hard thing.
          </Typography>
          <Typography variant='body1' gutterBottom component="div">
            The first time I got drunk was before my senior year of high school on a camping trip. So we were all young and truly dumb, should have been a forewarning for what alcohol
            would be like. I sipped a shot cause I didn't know what a shot was, and it tasted like jet fuel (or what I suspect jet fuel tastes like). My friend took 14 shots and
            100% had alcohol poisoning and we're lucky nothing worse happened. The next morning, a park ranger rolled up just as we put the trash bag of empty beers cans into the car
            and proceeded to ask for our IDs and scold us for camping in a non-camp spot... luckily just got a warning. The best part about it was running around the forest with
            my friend and laughing - maybe that's why I think of it fondly? I suppose?
          </Typography>
          <Typography variant='body1' gutterBottom component="div">
            I didn't really drink after that until college. I didn't like partying, at all (heyyyy introversion!). My friends were always excited when I decided to go out cause I
            really didn't join them much -- that felt good, I felt so wanted! I felt so special! But the alcohol was just gross flavors of Burnetts (whipped cream anyone?).
          </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 2,
              pt: 2,
              pb: 2
            }}>
              <Box sx={{ flex: '1 1 auto', maxWidth: { md: '60%' } }}>
                <Typography variant='body1' gutterBottom component="div">
                  Fast forward a couple years, I spend an entire summer in Paris and only when I visited Edinburgh at the end of that summer did I discover I liked wine? Not in France?
                  In Scotland? Lol, ok Annie. I spent a lot of time in England that summer and I really didn't drink any beer, but boy did I love the pubs. So cozy!!!
                  I really didn't like beer.
                </Typography>
              </Box>
              <Box sx={{
                flex: '0 0 auto',
                maxWidth: { xs: '100%', md: '40%' },
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Box>
                  <Paper elevation={16} sx={{ p: 2, fontWeight: 750, color: 'rgb(78, 171, 142)' }} maxWidth="100%">
                    Check out my old blog, <Link href="https://rumbelievable.wordpress.com/">Quoi De Neuf?</Link> from the summer of 2013, aw baby Annie!
                  </Paper>
                </Box>
              </Box>
            </Box>
            <Divider variant='body1' gutterBottom component="div" sx={{ pb: 3 }}>
                  RECORD SCRATCH
                </Divider>
            <Typography variant='body1' gutterBottom component="div">
              Hold up. I didn't like beer?? That feels impossible, since Annie's Birthday Brewery Crawl had a 7 year run. Breweries have been my comfort place, the place I
              felt like I could be out in the world without expending all of my energy. I came to love beer/breweries so much I created a 
              spreadsheet of all the breweries in Colorado (and from cities I'd been to outside of CO) and would seek them out to cross them off my list. 
              Whenever I travel to new places, the first thing I do is find the brewery -- it gives me the best sense of the place I'm visiting, and I 
              know I'll be comfortable.
            </Typography>
            <Typography variant='body1' gutterBottom component="div">
              It's funny, I'm typing this in a mixture of past tense and present tense cause, spoiler alert, I haven't drank in almost 2 months. 
              Sobriety is new to me. Is sobriety even the right word? It is, but damn it feels heavy. This is the way it feels in my head:
            </Typography>
            <Typography variant='body1' gutterBottom textAlign={'center'} component="div" sx={{ fontSize: 10, fontStyle: 'italic', mb: 3, color: 'grey' }}>
              sobriety
            </Typography>
            <Typography variant='body1' gutterBottom component="div">
              Kind of a scary word. Anyway, I decided to stop drinking. I didn't feel very good about myself, and stopping drinking felt like 
              the silver bullet for me. That is yet to be seen, but so far, I feel like a dirty window that had a good squeege clean. So 
              I'm going to keep doing it. We'll see if it's a forever thing or not. 
            </Typography>
            <Typography variant='body1' gutterBottom component="div">
                I'll still go to breweries, cause maybe it was never the 
              beer I cared about, maybe it was just the place and the company.
            </Typography>
        </Box>
      </Container>
      <ScrollTop {...props}>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  )
}

export default BlogPost;