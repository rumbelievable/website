import React from 'react';
import { Card, CardContent, Typography, Box, Chip, styled } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
  borderRadius: 10
}));

export const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

export const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export function Metadata({ card }) {
  const paddedId = String(card.id).padStart(2, '0');
  return (<Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      gap: 2,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px',
    }}
  >
    <Box
      sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
    >
      <Chip size="small" label={paddedId} />
    </Box>
    <Typography variant="caption">{card.date}</Typography>
  </Box>)
}
