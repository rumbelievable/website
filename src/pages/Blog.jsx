import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Grid2, Box, CardMedia, Divider, Paper, Chip } from '@mui/material';
import { StyledCard, StyledCardContent, Metadata } from '../components/BlogPostCard';

const cardData = [
  {
    id: 5,
    title: "Oops, I did it again",
    description: "",
    date: "November 2, 2024",
    link: "/blog/20241102",
    img: "https://res.cloudinary.com/df4rizvgx/image/upload/v1730568620/IMG_5638_ohp8as.jpg",
    tags: ["life", "programming"]
  },
  {
    id: 4,
    title: "Proud, Prouder, Proudest",
    description: "",
    date: "June 1, 2024",
    link: "/blog/20240601",
    img: "https://res.cloudinary.com/df4rizvgx/image/upload/v1730334529/IMG_5826_lyuvx7.jpg",
    tags: ["life", "woodworking"]
  },
  {
    id: 3,
    title: "Self-care, self-nurturing, self-sustenance: An Ode",
    description: "",
    date: "May 24, 2024",
    link: "/blog/20240524",
    img: "https://res.cloudinary.com/df4rizvgx/image/upload/v1716589582/blog_images/IMG_4855_cyiygn.jpg",
    tags: ["life"]
  },
  {
    id: 2,
    title: "Woodworking my way downtown",
    description: "",
    date: "May 17, 2024",
    link: "/blog/20240517",
    img: "https://res.cloudinary.com/df4rizvgx/image/upload/v1716000410/blog_images/IMG_3622_lv65cy.jpg",
    tags: ["woodworking"]
  },
  {
    id: 1,
    title: "Vulnerability Central",
    description: "",
    date: "May 13, 2024",
    link: "/blog/20240513",
    img: "https://res.cloudinary.com/df4rizvgx/image/upload/v1730334729/IMG_5099_j5h39o.jpg",
    tags: ["life"]
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
      <Paper sx={{ lineHeight: '60px' }} elevation={1}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', pl: 3, pb: 1, pt: 2 }}>
          Blog
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, pl: 3, pb: 3 }}>
          Stay in the loop of my machinations
        </Typography>
      </Paper>
      <Divider />
      <Grid2 container spacing={2} columns={12}>
        {cardData.map((card, index) => (
          <Grid2 size={{ xs: 12, md: 3 }} key={`${index + 1}-grid`}>
            <StyledCard
              variant="outlined"
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              tabIndex={index}
              className={focusedCardIndex === index ? 'Mui-focused' : ''}
              key={`${index + 1}-card`}
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
                <Box display="flex" flexWrap="wrap" gap={1} justifyContent="flex-end" alignItems="center">
                  {card.tags.map((tag, cardIndex) => (
                    <Typography gutterBottom variant="caption" component="div" key={`${cardIndex + 1}`}>
                      <Chip
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Typography>
                  ))}
                  </Box>
                  <Typography variant="h6" component="div">
                    {card.title}
                  </Typography>
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