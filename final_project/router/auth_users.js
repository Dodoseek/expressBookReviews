const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const JWT_SECRET = 'fingerprint_customer';

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let user = req.body.username;
  let pass = req.body.password;

  if (!user || !pass){
    return res.status(407).json({message: "Invalid data"});
  }

  if (authenticatedUser(user, pass)){
    let token = jwt.sign({data: pass}, JWT_SECRET, { expiresIn: 60 * 60 });

    req.session.authorization = {
      token,
      user
    };

    return res.status(200).send("User successfully logged in");
  }
  else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn; //true
  let review = req.query.review; //true
  let user = req.session.authorization["user"]; //true

  let isbns = Object.keys(books);

  if(isbns.includes(isbn)){
    books[isbn].reviews[user] = review;
    return res.status(200).json({message: "Entry updated successfully!"});
  }
  return res.status(408).json({message:"Error."})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn; //true
  let user = req.session.authorization["user"]; //true

  let isbns = Object.keys(books);

  if(isbns.includes(isbn)){
    delete books[isbn].reviews[user];
    return res.status(200).json({message: "Entry deleted successfully!"});
  }
  return res.status(408).json({message:"Error."})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
