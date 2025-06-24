import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://book-inventory-backend-nivq.onrender.com/api'
  : 'http://localhost:5000/api';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/books`);
      setBooks(response.data);
    } catch (error) {
      setError('Error fetching books: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`${API_URL}/books/${id}`);
        setSuccess('Book deleted successfully!');
        fetchBooks();
      } catch (error) {
        setError('Error deleting book: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const renderMobileView = () => (
    <Stack spacing={2}>
      {books.map((book) => (
        <Card key={book.id}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {book.title}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              by {book.author}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Publisher: {book.publisher}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ISBN: {book.isbn}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Price: ${book.price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quantity: {book.quantity}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={() => navigate(`/book/${book.id}`)}
            >
              View
            </Button>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/edit-book/${book.id}`)}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(book.id)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}
      {books.length === 0 && (
        <Typography align="center" color="text.secondary">
          No books found. Add a new book to get started!
        </Typography>
      )}
    </Stack>
  );

  const renderDesktopView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#e3e8ee' }}>
            <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Title</TableCell>
            <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Author</TableCell>
            <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Publisher</TableCell>
            <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Published Date</TableCell>
            <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>ISBN</TableCell>
            <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Price</TableCell>
            <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Quantity</TableCell>
            <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => (
            <TableRow
              key={book.id}
              hover
              onClick={() => navigate(`/book/${book.id}`)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.publisher}</TableCell>
              <TableCell>{new Date(book.publishedDate).toLocaleDateString()}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>${book.price}</TableCell>
              <TableCell>{book.quantity}</TableCell>
              <TableCell>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit-book/${book.id}`);
                  }}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(book.id);
                  }}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {books.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No books found. Add a new book to get started!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Book Inventory
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isMobile ? renderMobileView() : renderDesktopView()}

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess('')}
        message={success}
      />
    </Container>
  );
};

export default Home; 