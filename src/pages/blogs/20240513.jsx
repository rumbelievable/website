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
  Chip,
  Fade,
  Fab,
  useScrollTrigger
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export function ScrollTop(props) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

function BlogPost(props) {
  return (
    <React.Fragment>
    <Container maxWidth="md">
      <Box sx={{ my: 5}}>
        <Typography variant="h2" component="h1" gutterBottom>
          Vulnerability Central
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          May 13, 2024
        </Typography>
        <Typography variant='p'>
          Well, here we go. I've made a website, I'm not sure if it'll get hacked? I don't know how
          hacking works? Please don't hurt me. But yeah, I'm gonna assume
          no one is gonna be a jerk. Which means I'm gonna make an ass out of you and me. Mostly me.
          How did you get here? I have no idea. But how did I get here?
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <ArrowForwardIcon />
            </ListItemIcon>
            <ListItemText primary="My Squarespace website was annoying me how expensive it was, I mean, the website was mostly a vanity project so it was... a waste of money" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ArrowForwardIcon />
            </ListItemIcon>
            <ListItemText primary={<>I realized <em>I'm a programmer</em>, I could probably make this myself...</>} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ArrowForwardIcon />
            </ListItemIcon>
            <ListItemText primary="So I figured it out and made this little diddy 🤷" />
          </ListItem>
        </List>
        <Typography variant='p'>
          The main point of this website is for my photography, or what was my photography, in the
          hopes that maybe it'll inspire me again to take some snippity snaps.
          So you can find all that stuff, sorry if the formatting is messed up, I didn't dive tooooo
          deep into CSS 🏊. 
        </Typography>
        <Typography variant='p'>
          But otherwise, I kind of wanted a journal, which seems silly, cause this is public, but
          there are some things I thought might be cool to just blog about! How
          2004 of me!! You're not mad about it, you're probably my mum or my partner so you're just
          loving this anyway cause you think I'm so dang cute. Hi mum and Lace 👋.
        </Typography>
        <Typography variant="h4" gutterBottom sx={{ lineHeight: "24px", whiteSpace: 'pre-line' }}>
          {`\nSo what can you expect?`}
        </Typography>
        <Typography variant='p'>
          Well shoot, I dunno! I was thinking maybe some stuff like:
        </Typography>
        <List sx={{ listStyleType: 'disc' }}>
          <ListItem>
            <ListItemIcon>
              <ArrowForwardIcon />
            </ListItemIcon>
            <ListItemText primary="Football (This one ⚽ not that one 🏈)" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ArrowForwardIcon />
            </ListItemIcon>
            <ListItemText primary="Data engineering, cause I'm a professional gal!! And I think it's really neat!! Fight me!!" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ArrowForwardIcon />
            </ListItemIcon>
            <ListItemText primary={<>Queerness and non-monogamy-ness - cause I'm the <em>expert</em>. LOL.</>} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ArrowForwardIcon />
            </ListItemIcon>
            <ListItemText primary="Photography... if I can get the ✨ spark ✨ back" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ArrowForwardIcon />
            </ListItemIcon>
            <ListItemText primary="Anything else I want, this is my blog! Back off!" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ArrowForwardIcon />
            </ListItemIcon>
            <ListItemText primary="Sorry. That was aggressive." />
          </ListItem>
        </List>
        <Typography variant='h5'>Stay tuned!</Typography>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 100 }}>
            Tags
          </Typography>
          <Chip label="life" />
        </Box>
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