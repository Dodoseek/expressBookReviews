const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(username && password)
  {
    if (!doesExist(username))
    {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } 
    else 
    {
      return res.status(406).json({message: "User already exists!"})
    };
  }
  return res.status(404).json({message: "Unable to register user."});
});

let returnbooks = ()=>books;
let returnBookISBN = (req)=>books[req.params.isbn] ? books[req.params.isbn] : "Error. This ISBN does not exist.";
let returnBookAuthor = (req, el)=>books[el].author === req.params.author ? true : false;
let returnBookTitle = (req, el)=>books[el].title === req.params.title ? true : false;

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  let result = await returnbooks();
  res.send(result);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res){
  let result = await returnBookISBN(req);
  res.send(result);
});

  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  send = false
  for (let el in books){
    await returnBookAuthor(req, el) ? (res.send(books[el]), send = true) : false;
  }
  if (!send){res.send("ERROR. This author does not exist")}
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  send = false
  for (let el in books){
    await returnBookTitle(req, el) ? (res.send(books[el]), send = true): false;
  }
  if (!send){res.send("ERROR. This title does not exist")}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  res.send(books[req.params.isbn] ? books[req.params.isbn].reviews : "Error. This ISBN does not exist.");
});

module.exports.general = public_users;
