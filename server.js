const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// More specific CORS configuration
const corsOptions = {
  origin: 'https://sweeti12.github.io',
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for React app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Sample data store (replace with a database in production)
let books = [];

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
app.get('/api/books', (req, res) => {
  try {
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

app.get('/api/books/:id', (req, res) => {
  try {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
});

app.post('/api/books', (req, res) => {
  try {
    const newBook = {
      id: books.length + 1,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    books.push(newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
});

app.put('/api/books/:id', (req, res) => {
  try {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) return res.status(404).json({ message: 'Book not found' });
    
    books[bookIndex] = {
      ...books[bookIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json(books[bookIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
});

app.delete('/api/books/:id', (req, res) => {
  try {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) return res.status(404).json({ message: 'Book not found' });
    
    const deletedBook = books.splice(bookIndex, 1);
    res.json(deletedBook[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
});

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 