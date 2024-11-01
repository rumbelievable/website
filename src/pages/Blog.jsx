import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Grid2, Box, CardMedia, Divider, Paper } from '@mui/material';
import { StyledCard, StyledCardContent, StyledTypography, Metadata } from '../components/BlogPostCard';

const cardData = [
  {
    id: 4,
    title: "Proud, Prouder, Proudest",
    description: "",
    date: "June 1, 2024",
    link: "/blog/20240601",
    img: "https://res.cloudinary.com/df4rizvgx/image/upload/v1730334529/IMG_5826_lyuvx7.jpg",
    tag: ""
  },
  {
    id: 3,
    title: "Self-care, self-nurturing, self-sustenance: An Ode",
    description: "",
    date: "May 24, 2024",
    link: "/blog/20240524",
    img: "https://res.cloudinary.com/df4rizvgx/image/upload/v1716589582/blog_images/IMG_4855_cyiygn.jpg",
    tag: ""
  },
  {
    id: 2,
    title: "Woodworking my way downtown",
    description: "",
    date: "May 17, 2024",
    link: "/blog/20240517",
    img: "https://res.cloudinary.com/df4rizvgx/image/upload/v1716000410/blog_images/IMG_3622_lv65cy.jpg",
    tag: ""
  },
  {
    id: 1,
    title: "Vulnerability Central",
    description: "",
    date: "May 13, 2024",
    link: "/blog/20240513",
    img: "https://res.cloudinary.com/df4rizvgx/image/upload/v1730334729/IMG_5099_j5h39o.jpg",
    tag: ""
  }
];


const Blog = () => {
  const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 3 }}>
      <Paper sx={{ lineHeight: '60px' }} elevation={8}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', pl: 3, pb: 2, pt: 2 }}>
          Blog
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, pl: 3, pb: 3 }}>
          Stay in the loop of my machinations
        </Typography>
        </Paper>
      <Divider />
      <Grid2 container spacing={2} columns={12}>
        {cardData.map((card, index) => (
          <Grid2 size={{ xs: 12, md: 3 }}>
            <StyledCard
              variant="outlined"
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              tabIndex={index}
              className={focusedCardIndex === index ? 'Mui-focused' : ''}
            >
              <Link
                to={card.link}
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                <CardMedia
                  component="img"
                  alt={card.title}
                  image={card.img}
                  sx={{
                    aspectRatio: '16 / 9',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    height: '80%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />
                <StyledCardContent>
                  <Typography gutterBottom variant="caption" component="div">
                    {card.tag}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    {card.title}
                  </Typography>
                  <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                    {card.description}
                  </StyledTypography>
                </StyledCardContent>
                <Metadata card={card} />
              </Link>
            </StyledCard>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  )
}

export default Blog;