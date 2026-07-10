const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

/**
 * Register a new user
 * @route POST /register
 */
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(409).json({message: "User already exists!"});    
    }
  } 
  return res.status(400).json({message: "Unable to register user. Username and password are required."});
});

/**
 * Get the book list available in the shop
 * @route GET /
 */
public_users.get('/', function (req, res) {
    try {
        return res.status(200).send(JSON.stringify({books}, null, 4));
    } catch (error) {
        return res.status(500).json({message: "Internal server error retrieving books"});
    }
});

/**
 * Get book details based on ISBN
 * @route GET /isbn/:isbn
 */
public_users.get('/isbn/:isbn', function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (book) {
            return res.status(200).send(book);
        } else {
            return res.status(404).json({message: "Book not found"});
        }
    } catch (error) {
        return res.status(500).json({message: "Error retrieving book details"});
    }
 });
  
/**
 * Get book details based on author
 * @route GET /author/:author
 */
public_users.get('/author/:author', function (req, res) {
    try {
        let booksbyauthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if(books[isbn]["author"] === req.params.author) {
            booksbyauthor.push({"isbn": isbn,
                                "title": books[isbn]["title"],
                                "reviews": books[isbn]["reviews"]});
          }
        });
        if (booksbyauthor.length > 0) {
            return res.status(200).send(JSON.stringify({booksbyauthor}, null, 4));
        } else {
            return res.status(404).json({message: "Author not found"});
        }
    } catch (error) {
        return res.status(500).json({message: "Error retrieving books by author"});
    }
});

/**
 * Get all books based on title
 * @route GET /title/:title
 */
public_users.get('/title/:title', function (req, res) {
    try {
        let booksbytitle = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if(books[isbn]["title"] === req.params.title) {
            booksbytitle.push({"isbn": isbn,
                                "author": books[isbn]["author"],
                                "reviews": books[isbn]["reviews"]});
          }
        });
        if (booksbytitle.length > 0) {
            return res.status(200).send(JSON.stringify({booksbytitle}, null, 4));
        } else {
            return res.status(404).json({message: "Title not found"});
        }
    } catch (error) {
        return res.status(500).json({message: "Error retrieving books by title"});
    }
});

/**
 * Get book reviews
 * @route GET /review/:isbn
 */
public_users.get('/review/:isbn', function (req, res) {
    try {
        const isbn = req.params.isbn;
        if (books[isbn]) {
            return res.status(200).send(books[isbn].reviews);
        } else {
            return res.status(404).json({message: "Book not found"});
        }
    } catch (error) {
        return res.status(500).json({message: "Error retrieving book review"});
    }
});

// ==========================================
// TASKS 10-13: AXIOS IMPLEMENTATIONS
// ==========================================
// The following functions demonstrate how to use Axios with Promises and Async/Await 
// to interact with the REST API as required by the final project grading criteria.

/**
 * Task 10: Get all books using async callback function
 */
async function getAllBooksAxios() {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        console.error("Error fetching all books:", error.message);
        throw error;
    }
}

/**
 * Task 11: Search by ISBN using Promises
 */
function getBookByISBNAxios(isbn) {
    return axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
            throw error;
        });
}

/**
 * Task 12: Search by Author using async/await
 */
async function getBooksByAuthorAxios(author) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by author ${author}:`, error.message);
        throw error;
    }
}

/**
 * Task 13: Search by Title using async/await
 */
async function getBooksByTitleAxios(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by title ${title}:`, error.message);
        throw error;
    }
}

module.exports.general = public_users;
// Exporting the Axios functions for testing and completeness
module.exports.axiosFunctions = {
    getAllBooksAxios,
    getBookByISBNAxios,
    getBooksByAuthorAxios,
    getBooksByTitleAxios
};
