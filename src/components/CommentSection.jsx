import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Avatar, Grid2 } from '@mui/material';

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { id: Date.now(), text: newComment, author: 'Anonymous' }]);
      setNewComment('');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Comments</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Post Comment
        </Button>
      </Box>
      {comments.map((comment) => (
        <Box key={comment.id} sx={{ mb: 2 }}>
          <Grid2 container spacing={2}>
            <Grid2 item>
              <Avatar>{comment.author[0]}</Avatar>
            </Grid2>
            <Grid2 item xs>
              <Typography variant="subtitle1" component="div">
                {comment.author}
              </Typography>
              <Typography variant="body1">{comment.text}</Typography>
            </Grid2>
          </Grid2>
        </Box>
      ))}
    </Box>
  );
};

export default CommentSection;