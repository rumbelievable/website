import React from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Link,
  Paper,
  Fab
} from '@mui/material';
import RainbowIcon from '@mui/icons-material/Looks';
import BrainIcon from '@mui/icons-material/Psychology';
import VenusDoubleIcon from '@mui/icons-material/Female';
import PawIcon from '@mui/icons-material/Pets';
import BookIcon from '@mui/icons-material/Book';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import ChecklistIcon from '@mui/icons-material/Checklist';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { ScrollTop } from './20240513';
import CommentSection from '../../components/CommentSection';

function BlogPost(props) {
  return (
    <React.Fragment>
      <Container maxWidth="md">
        <Box component="article" sx={{ pt: 5 }}>
          <Typography variant="h2" gutterBottom>
            Proud, Prouder, Proudest
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            June 1, 2024
          </Typography>

          <Typography variant='body1' gutterBottom component="div">
            <RainbowIcon /> Happy Pride Month my fellow queers and lovers of queers! I just froze while trying to write
            this opening because my brain was like:
          </Typography>

          <Paper elevation={3} sx={{ p: 2, mt: 2, mb: 2, bgcolor: 'background.default', lineHeight: "24px", whiteSpace: 'pre-line' }}>
            <Typography variant='body1' gutterBottom component="div">
              <BrainIcon /> Ok, now you need to hit on the following things to make sure you don't leave any important
              matters unmentioned such as:
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="The importance of Pride month and how it was started by trans women of color."
                  secondary={<Link href="https://en.wikipedia.org/wiki/Stonewall_riots">Learn more</Link>}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="How many anti-LGBTQ+ laws there are and how many are being funneled through at a terrifying pace."
                  secondary={<Link href="https://www.aclu.org/legislative-attacks-on-lgbtq-rights-2024">ACLU report</Link>}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Pride month is every month, but give all your money to the LGBTQ+ causes you care about this month and tell your companies to match it."
                  secondary={<Link href="https://lgbtqcolorado.org/support/give/">The Center on Colfax</Link>}
                />
              </ListItem>
            </List>
            <Typography variant='h5' sx={{ align: 'center', textAlign: 'center' }}>
              Find places to donate locally!!!
            </Typography>
          </Paper>

          <Typography variant='body1' gutterBottom component="div">
          There's so much more swirling around in my mind, but I need to learn that I can't do or say it all.
          I am wrapping up my two week mini sabbatical this weekend as I start a new job on Monday, and I wanted to reflect on this time. 
          It may seem silly to give a two week break between jobs so much air time, but I've never done it before. 
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
                Any other breaks or vacations or unemployment stints I've had felt like
              </Typography>
            </Box>
            <Box sx={{
              flex: '0 0 auto',
              maxWidth: { xs: '100%', md: '40%' },
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Box
                component="img"
                src="https://i.imgflip.com/8sg8sk.jpg"
                alt="Meme"
                sx={{
                  width: '100%',
                  maxWidth: 300,
                  height: 'auto'
                }}
              />
            </Box>
          </Box>
          <Typography variant='body1' gutterBottom component="div">
            And this time, my brain was free. Or as free as my brain can be. And I couldn’t be more grateful to have had that time – I deserved it.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <VenusDoubleIcon />
              </ListItemIcon>
              <ListItemText primary=" I got to spend time with my lovely partner (she cute, hi boo x)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PawIcon />
              </ListItemIcon>
              <ListItemText primary="I got to spend some very quality time with my pups, taking them swimming and hiking and building
                them a dog bed cause I'm that person." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BookIcon />
              </ListItemIcon>
              <ListItemText primary="I got to read books on my porch and watch TV whenever I wanted." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SportsBarIcon />
              </ListItemIcon>
              <ListItemText primary="I got to say yes to plans without the nagging “it’s a school night” energy I’m used to. I got to say no to making plans cause JOMO." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ChecklistIcon />
              </ListItemIcon>
              <ListItemText primary="I got to do tedious things and check them off my to-do list (therefore making them glorious, type A wins)." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InsertEmoticonIcon />
              </ListItemIcon>
              <ListItemText primary="I got to do whatever the h*ck I wanted." />
            </ListItem>
          </List>
        </Box>
        <CommentSection />
      </Container>
      <ScrollTop {...props}>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
};

export default BlogPost;