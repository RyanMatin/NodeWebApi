var express = require('express');

// It is is better to create routes as a funciton for better testebility using injeciton.
// Thus the Book is an input parameter of the function which will be passed by the caller.
var routes = function(Book) {
    // create a router instance
    var bookRouter = express.Router();

    // define all of the routes (http://localhost:8000/api/books)
    bookRouter.route('/')
    .post(function(req, res) {
        // prepare a book instance from bod-parse json
        var book = new Book(req.body);

        // save the boko in DB
        book.save();
        
        // send back status 201 (created) and saved book (with generated _id)
        res.status(201).send(book);
    })
    .get(function(req, res){
        // Sanitized Query: Only querying by genre
        var query = {};
        if(req.query.genre) {
        query.genre = req.query.genre;
        }

        // reading books from MongoDB using mongoose
        Book.find(query, function(err, books){
        if(err) res.status(500).send(err);//console.log(err);
        else res.json(books);
        });
    });

    // Query by Book ID: http://localhost:8000/api/books/58cb057642309a22e51f948a
    bookRouter.route('/:bookId')
    .get(function(req, res){
        // reading books from MongoDB using mongoose
        Book.findById(req.params.bookId, function(err, book){
        if(err) res.status(500).send(err);//console.log(err);
        else res.json(book);
        });
    });

    return bookRouter;
};

module.exports = routes;