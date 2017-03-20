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

    // adding a middleware for a route that has bookId.
    // next tells it to pass on to the next thing that's to be done.
    // In our case it will go to the .get or .put in below. 
    // We can apply  multiple middleware.
    bookRouter.use('/:bookId', function(req, res, next){
        Book.findById(req.params.bookId, function(err, book){
            if(err) res.status(500).send(err);
            else if (book) {
                // if the book exist, add it to the request to make it available everything downstream
                req.book = book;

                next();
            }
            else {
                // if the book does not exis
                res.status(404).send('book not found ' + req.params.bookId);
            }
        });
    });

    // Book ID: http://localhost:8000/api/books/58cb057642309a22e51f948a
    bookRouter.route('/:bookId')
        // query
        .get(function(req, res){
            res.json(req.book);
        })
        // put (update)
        .put(function(req, res){
            // do not include _id (we don't want to override DB _id with request _id)
            req.book.title = req.body.title;
            req.book.author = req.body.author;
            req.book.genre = req.body.genre;
            req.book.read = req.body.read;

            // Async: save and return the book
            req.book.save(function(err, book){
                if(err) res.status(500).send(err);
                else res.json(req.book);
            });

            // Sync: save and return the book
            // req.book.save();
            // res.json(req.book);

        })
        // patch (update partially)
        .patch(function(req, res){
            // only update a field if it exist in the request body.
            // if(req.body.title) req.book.title = req.body.title;

            // but since the job above is painful, so we use for-in loop
            // for every key in req.body, givem ethe key name, and assign it to our variable.
            // the only cvaviat to that is that we don't want to update the _id. So we will delete that property for the object;
            if(req.body._id) delete req.body._id;

            for(var p in req.body) {
                req.book[p] = req.body[p];
            }

            // Async: save and return the book
            req.book.save(function(err, book){
                if(err) res.status(500).send(err);
                else res.json(req.book);
            });
        })
        // delete (single item by id)
        .delete(function(req, res) {
            req.book.remove(function(err){
                if(err) res.status(500).send(err);
                else res.status(204).send('Book Removed'); //204: removed
            });
        });

    return bookRouter;
};

module.exports = routes;