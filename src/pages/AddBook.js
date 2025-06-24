import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://book-inventory-backend-nivq.onrender.com/api'
  : 'http://localhost:5000/api';

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must not exceed 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,!?'"()]+$/, 'Title contains invalid characters'),
  
  author: yup
    .string()
    .required('Author is required')
    .min(2, 'Author name must be at least 2 characters')
    .max(50, 'Author name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s\-']+$/, 'Author name can only contain letters, spaces, hyphens, and apostrophes'),
  
  publisher: yup
    .string()
    .required('Publisher is required')
    .min(2, 'Publisher name must be at least 2 characters')
    .max(50, 'Publisher name must not exceed 50 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,&]+$/, 'Publisher name contains invalid characters'),
  
  publishedDate: yup
    .date()
    .required('Published date is required')
    .max(new Date(), 'Published date cannot be in the future')
    .min(new Date('1900-01-01'), 'Published date cannot be before 1900'),
  
  isbn: yup
    .string()
    .required('ISBN is required')
    .matches(
      /^(?:\d[- ]?){9}[\dX]$/,
      'ISBN must be in the format: XXXXXXXXXX or XXXX-XXXX-X'
    )
    .test('isbn-valid', 'Invalid ISBN', (value) => {
      if (!value) return true;
      // Remove hyphens and spaces
      const isbn = value.replace(/[-\s]/g, '');
      // Check if it's a valid ISBN-10
      if (isbn.length === 10) {
        let sum = 0;
        for (let i = 0; i < 9; i++) {
          sum += parseInt(isbn[i]) * (10 - i);
        }
        const checkDigit = isbn[9].toUpperCase() === 'X' ? 10 : parseInt(isbn[9]);
        sum += checkDigit;
        return sum % 11 === 0;
      }
      return false;
    }),
  
  price: yup
    .number()
    .required('Price is required')
    .min(0, 'Price must be positive')
    .max(10000, 'Price cannot exceed $10,000')
    .test(
      'price-decimal',
      'Price can have up to 2 decimal places',
      (value) => !value || /^\d+(\.\d{0,2})?$/.test(value.toString())
    ),
  
  quantity: yup
    .number()
    .required('Quantity is required')
    .integer('Quantity must be a whole number')
    .min(0, 'Quantity must be positive')
    .max(10000, 'Quantity cannot exceed 10,000'),
  
  overview: yup
    .string()
    .required('Overview is required')
    .min(50, 'Overview must be at least 50 characters')
    .max(2000, 'Overview must not exceed 2000 characters')
    .matches(
      /^[a-zA-Z0-9\s\-_.,!?'"()]+$/,
      'Overview contains invalid characters'
    ),
});

const AddBook = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formik = useFormik({
    initialValues: {
      title: '',
      author: '',
      publisher: '',
      publishedDate: '',
      isbn: '',
      price: '',
      quantity: '',
      overview: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post(`${API_URL}/books`, values);
        setSuccess('Book added successfully!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        setError('Error adding book: ' + (error.response?.data?.message || error.message));
      }
    },
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Book
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="author"
                  name="author"
                  label="Author"
                  value={formik.values.author}
                  onChange={formik.handleChange}
                  error={formik.touched.author && Boolean(formik.errors.author)}
                  helperText={formik.touched.author && formik.errors.author}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="publisher"
                  name="publisher"
                  label="Publisher"
                  value={formik.values.publisher}
                  onChange={formik.handleChange}
                  error={formik.touched.publisher && Boolean(formik.errors.publisher)}
                  helperText={formik.touched.publisher && formik.errors.publisher}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="publishedDate"
                  name="publishedDate"
                  label="Published Date"
                  type="date"
                  value={formik.values.publishedDate}
                  onChange={formik.handleChange}
                  error={formik.touched.publishedDate && Boolean(formik.errors.publishedDate)}
                  helperText={formik.touched.publishedDate && formik.errors.publishedDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="isbn"
                  name="isbn"
                  label="ISBN"
                  value={formik.values.isbn}
                  onChange={formik.handleChange}
                  error={formik.touched.isbn && Boolean(formik.errors.isbn)}
                  helperText={formik.touched.isbn && formik.errors.isbn}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="price"
                  name="price"
                  label="Price"
                  type="number"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="quantity"
                  name="quantity"
                  label="Quantity"
                  type="number"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                  helperText={formik.touched.quantity && formik.errors.quantity}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="overview"
                  name="overview"
                  label="Book Overview"
                  multiline
                  rows={4}
                  value={formik.values.overview}
                  onChange={formik.handleChange}
                  error={formik.touched.overview && Boolean(formik.errors.overview)}
                  helperText={formik.touched.overview && formik.errors.overview}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={formik.isSubmitting}
              >
                Add Book
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess('')}
        message={success}
      />
    </Container>
  );
};

export default AddBook; 