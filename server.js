const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for React app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Sample data store (replace with a database in production)
let books = [];

// Route to get all books
app.get('/api/books', (req, res) => {
  res.json(books);
});

// Route to get a single book by ID
app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// Route to add a new book
app.post('/api/books', (req, res) => {
  const newBook = {
    id: books.length + 1, // Simple ID generation
    ...req.body,
    createdAt: new Date().toISOString()
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// Route to update a book
app.put('/api/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) return res.status(404).json({ message: 'Book not found' });
  
  books[bookIndex] = {
    ...books[bookIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json(books[bookIndex]);
});

// Route to delete a book
app.delete('/api/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) return res.status(404).json({ message: 'Book not found' });
  
  const deletedBook = books.splice(bookIndex, 1);
  res.json(deletedBook[0]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 