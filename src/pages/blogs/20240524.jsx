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
  Chip,
  Link,
  Paper,
  Fab
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ScrollTop } from './20240513';

const listItems = [
  { text: "Get an ergonomic mouse, one of those really horrendous ones, so I don't give myself carpal tunnel… again", label: "home" },
  { text: "Exercise a little everyday and a lot at least 3 times a week", label: "life" },
  { text: "Create a routine for the dogs because having an 8 month old puppy is a lot of work too. Not Tetley, she's an angel", label: "life" },
  { text: "Set expectations with my new manager on day one, including that I have a propensity to burn myself out:", label: "work" },
  { text: "Set working hours", label: "work" },
  { text: "I don't need to be at 100% maximum performance everyday - I have worked with people who managed to do just one ticket in 4 weeks… and they got promoted", label: "work" },
  { text: "When the laptop is shut, the laptop is shut - remote work habits!!!", label: "home" },
  { text: "Maybe I should use the last 20 minutes of my day to write myself an email of what I'm thinking to just get it all out of my brain?", label: "home" },
  { text: "Don't download Slack to my phone", label: "work" },
  { text: "Stand at my standing desk for at least 1 hour per day", label: "home" },
  { text: "Block off 12pm-1pm on my calendar for a break", label: "home" },
  { text: "For meetings that I can just listen to, do it on a walk", label: "home" },
  { text: "Do some stretching everyday", label: "life" },
  { text: "WATER!!", label: "life" }
];

const updatedListItems = [
  { text: "Show your work", label: "work" },
  { text: "Do things that’ll make you look good", label: "work" },
  { text: "Don’t volunteer for other people’s work", label: "work" },
  { text: "Take a break in the middle of the day", label: "home" },
  { text: "TAKE PTO - set a goal (20-25 days)", label: "life" },
  { text: "It’s just ____ (e.g. if you work in cable, \"it's just cable\")", label: "work" }
]

function BlogPost(props) {
  const getChipColor = (label) => {
    switch (label) {
      case 'home':
        return 'primary';
      case 'work':
        return 'secondary';
      case 'life':
        return 'info';
      default:
        return 'default';
    }
  };
  return (
    <React.Fragment>
      <Container maxWidth="md">
        <Box component="article" sx={{ pt: 5 }}>
          <Typography variant="h2" gutterBottom>
            Self-care, self-nurturing, self-sustenance: An Ode
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            May 24, 2024 | Updated: May 26, 2024
          </Typography>

          <Typography variant='body1' gutterBottom component="div">
            I started to search on Reddit just now, "self care tips for data engineers", and because I didn't find an
            answer immediately, I decided this might be a good time for a post. It'll be an exercise in a good ol'
            fashioned brain dump.
          </Typography>

          <Typography variant='body1' gutterBottom component="div">
            I quit my last job a few weeks ago, and am currently in the middle of a well-deserved two week break until
            I start my next position as a Senior Data Engineer. It is probably the most important two week period I've
            had in a long time… no pressure. I wanted to make the most out of it, without feeling like I was putting too
            much stress on myself to do so. It's sort of like the feeling when you see a celebrity in real life, but
            you want to act cool, so you end up acting like a weird, robotic, non-sentient version of yourself? Does that
            make sense?
          </Typography>

          <Typography variant='body1' gutterBottom component="div">
            So, I wrote down a few things I wanted to do:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
              <ListItemText primary="Hike with the dogs" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
              <ListItemText primary="Finish the dog bed I've been building" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
              <ListItemText primary="Read" />
            </ListItem>
          </List>

          <Typography variant='body1' gutterBottom component="div">
            And I've done pretty well which makes me happy! Look at my happy dogs! Success!
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ width: '100%', pt: 2 }}
          >
            <Card sx={{ mb: 2, maxWidth: '50%' }}>
              <CardMedia
                component="img"
                image="https://res.cloudinary.com/df4rizvgx/image/upload/v1716589582/blog_images/IMG_4855_cyiygn.jpg"
                alt="Happy dogs"
                sx={{ width: '100%', height: 'auto' }}
              />
            </Card>
          </Box>

          <Typography variant='body1' gutterBottom component="div">
            But it opened up a larger can of worms in my brain:
          </Typography>

          <Paper elevation={3} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
            <Typography>
              I don't just want this self-care, self-nurturing and
              self-sustenance for these two weeks, I want it for my first two weeks at my new job, and for every day,
              week, month and year beyond.
            </Typography>
          </Paper>

          <Typography variant='body1' gutterBottom component="div">
            I worked my fingers to the bone at my last job, I burnt out my burn
            outs, I gave pretty much all my brain capacity to a job and company that didn't
            really give a shit about me.
          </Typography>

          <Typography variant='body1' gutterBottom component="div">
            I cannot do that again. So I want a fresh start.
          </Typography>

          <Typography variant='body1' gutterBottom component="div" >
            My brain is doing a lot of <Link href="https://youtu.be/7g3DdVhDmrU?si=-vTL14jL2wIcqzoB&t=62">oscillating</Link> between practical things I can do, and more perspective shifts, so
            h*ck it, I'll write 'em all down and I'll code them cause I love a good code!!!
          </Typography>

          <div>
            <Typography variant="h5" gutterBottom sx={{ lineHeight: "24px", whiteSpace: 'pre-line' }}>
              {`\nThe Legend`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label="home" color="primary" />
              <Chip label="work" color="secondary" />
              <Chip label="life" color="info" />
            </Box>
          </div>

          <Typography variant="h5" gutterBottom>
            The List
          </Typography>
          <List>
            {listItems.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Chip
                    label={item.label}
                    color={getChipColor(item.label)}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>

          <Typography variant='body1' gutterBottom component="div">
            I am very lucky to have a well paying job, benefits, the ability to work from home, in a home of my own. I
            am very grateful for this. And I don't owe any company or job my entire life. (Pardon the mantra).
          </Typography>

          <Typography variant='body1' gutterBottom component="div">
            I'm going to prune this list down and make it less, better. (IYKYK).
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant='body1' gutterBottom component="div" sx={{ fontStyle: 'italic' }}>
            After polling my friends, I have some additions!
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ lineHeight: "24px", whiteSpace: 'pre-line' }}>
            {`\nUPDATED LIST`}
          </Typography>
          <List>
            {updatedListItems.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Chip
                    label={item.label}
                    color={getChipColor(item.label)}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
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