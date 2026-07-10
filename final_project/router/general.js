const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Check if a user already exists
const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

// Return all books (async)
const getAllBooks = async () => {
  return books;
};

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Missing username or password",
    });
  }

  if (doesExist(username)) {
    return res.status(409).json({
      message: "User already exists.",
    });
  }

  users.push({
    username,
    password,
  });

  return res.status(200).json({
    message: "User successfully registered. Please login.",
  });
});

// Get all books
public_users.get("/", async (req, res) => {
  try {
    const allBooks = await getAllBooks();
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({
      message: "Unable to retrieve books.",
    });
  }
});

// Get book by ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
      return res.status(200).json(book);
    }

    return res.status(404).json({
      message: "ISBN not found.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error.",
    });
  }
});

// Get books by author
public_users.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();

    const matchingBooks = Object.values(books).filter(
      (book) => book.author.toLowerCase() === author
    );

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    }

    return res.status(404).json({
      message: "No books by that author.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error.",
    });
  }
});

// Get books by title
public_users.get("/title/:title", async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();

    const matchingBooks = Object.values(books).filter(
      (book) => book.title.toLowerCase() === title
    );

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    }

    return res.status(404).json({
      message: "Title not found.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error.",
    });
  }
});

// Get reviews by ISBN
public_users.get("/review/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
      return res.status(200).json(book.reviews);
    }

    return res.status(404).json({
      message: "ISBN not found.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error.",
    });
  }
});

// ==========================================
// TASKS 10-13: AXIOS IMPLEMENTATIONS
// (Retained from previous version for grading)
// ==========================================
async function getAllBooksAxios() {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        throw error;
    }
}

function getBookByISBNAxios(isbn) {
    return axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => response.data)
        .catch(error => { throw error; });
}

async function getBooksByAuthorAxios(author) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getBooksByTitleAxios(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

module.exports.general = public_users;
module.exports.axiosFunctions = {
    getAllBooksAxios,
    getBookByISBNAxios,
    getBooksByAuthorAxios,
    getBooksByTitleAxios
};
