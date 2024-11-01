import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';

function CommentForm() {
  const [comment, setComment] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Submitted comment:', comment);
    setComment('');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Leave a Comment
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Your Comment"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
          Submit
        </Button>
      </form>
    </Container>
  );
}

export default CommentForm;
