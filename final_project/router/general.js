const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).send(book);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      }
    });
    if (booksbyauthor.length > 0) {
        return res.status(200).send(JSON.stringify({booksbyauthor}, null, 4));
    } else {
        return res.status(404).json({message: "Author not found"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]});
      }
    });
    if (booksbytitle.length > 0) {
        return res.status(200).send(JSON.stringify({booksbytitle}, null, 4));
    } else {
        return res.status(404).json({message: "Title not found"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.status(200).send(books[isbn].reviews);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

// ==========================================
// TASKS 10-13: AXIOS IMPLEMENTATIONS
// ==========================================

// Task 10: Get all books using async callback function
async function getAllBooksAxios() {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log("All books:", response.data);
    } catch (error) {
        console.error("Error fetching all books:", error.message);
    }
}

// Task 11: Search by ISBN using Promises
function getBookByISBNAxios(isbn) {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            console.log(`Book with ISBN ${isbn}:`, response.data);
        })
        .catch(error => {
            console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
        });
}

// Task 12: Search by Author using async/await
async function getBooksByAuthorAxios(author) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(`Books by author ${author}:`, response.data);
    } catch (error) {
        console.error(`Error fetching books by author ${author}:`, error.message);
    }
}

// Task 13: Search by Title using async/await
async function getBooksByTitleAxios(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log(`Books with title ${title}:`, response.data);
    } catch (error) {
        console.error(`Error fetching books by title ${title}:`, error.message);
    }
}

module.exports.general = public_users;
