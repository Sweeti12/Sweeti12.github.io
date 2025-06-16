import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${API_URL}/books/${id}`);
        setBook(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching book details: ' + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`${API_URL}/books/${id}`);
        navigate('/');
      } catch (error) {
        setError('Error deleting book: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Book not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to List
      </Button>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {book.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            by {book.author}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Publisher
            </Typography>
            <Typography variant="body1" paragraph>
              {book.publisher}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary">
              Published Date
            </Typography>
            <Typography variant="body1" paragraph>
              {new Date(book.publishedDate).toLocaleDateString()}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary">
              ISBN
            </Typography>
            <Typography variant="body1" paragraph>
              {book.isbn}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Price
            </Typography>
            <Typography variant="body1" paragraph>
              ${book.price}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary">
              Quantity in Stock
            </Typography>
            <Typography variant="body1" paragraph>
              {book.quantity} {book.quantity === 1 ? 'copy' : 'copies'}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary">
              Status
            </Typography>
            <Typography 
              variant="body1" 
              paragraph
              sx={{ 
                color: book.quantity > 0 ? 'success.main' : 'error.main',
                fontWeight: 'bold'
              }}
            >
              {book.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Book Overview
            </Typography>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                backgroundColor: 'background.default',
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              <Typography variant="body1" paragraph>
                {book.overview || 'No overview available for this book.'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/edit-book/${id}`)}
          >
            Edit Book
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete Book
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookDetails; 