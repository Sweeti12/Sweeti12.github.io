# Book Inventory Management System

A modern web application built with React for managing a collection of books. This application provides a user-friendly interface for performing CRUD operations on book inventory.

## Features

- View a list of all books in the inventory
- Add new books to the inventory
- Edit existing book details
- Delete books from the inventory
- View detailed information about each book
- Responsive design that works on all devices
- Form validation for all input fields
- Modern and intuitive user interface

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd book-inventory-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## API Integration

The application is configured to work with a REST API. You'll need to update the API endpoints in the following files:

- `src/pages/Home.js`
- `src/pages/BookDetails.js`
- `src/pages/AddBook.js`
- `src/pages/EditBook.js`

Replace the placeholder URLs (`https://api.example.com/books`) with your actual API endpoints.

## Form Validation

The application includes comprehensive form validation for all input fields:

- Title: Required, minimum 2 characters
- Author: Required, minimum 2 characters
- Publisher: Required
- Published Date: Required, cannot be in the future
- ISBN: Required, must match ISBN format
- Price: Required, must be positive
- Quantity: Required, must be a non-negative integer
- Overview: Required, minimum 10 characters

## Technologies Used

- React
- React Router
- Material-UI
- Formik
- Yup
- Axios

## Project Structure

```
src/
  ├── components/
  │   └── Navbar.js
  ├── pages/
  │   ├── Home.js
  │   ├── BookDetails.js
  │   ├── AddBook.js
  │   └── EditBook.js
  ├── App.js
  └── index.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 