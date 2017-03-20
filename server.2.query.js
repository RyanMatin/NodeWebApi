// 1. create a reference to express
var express = require('express');


// =================================
// 1.1. create a refernce to Mongoose
var mongoose = require('mongoose');

// 1.2. conenct to MongoDB database (bookAPI). It create DB if not exists. 
var db = mongoose.connect('mongodb://localhost/bookAPI')

// 1.3. Translate the MongoDB data into a model
var Book = require('./models/bookModel');
// =================================


// 2. create  an instance of express to start running our stuff
var app = express();

// 3. setup a port (way#1 using environment process)
var port = process.env.PORT || 3000;

// 4. create a router instance
var bookRouter = express.Router();

// 5. define all of the routes (http://localhost:8000/api/books)
bookRouter.route('/Books')
  .get(function(req, res){
    // Sanitized Query: Only querying by genre
    var query = {};
    if(req.query.genre) {
      query.genre = req.query.genre;
    }

    // 5.1. reading books from MongoDB using mongoose
    Book.find(query, function(err, books){
      if(err) res.status(500).send(err);//console.log(err);
      else res.json(books);
    });
  });

// Query by Book ID: http://localhost:8000/api/books/58cb057642309a22e51f948a
bookRouter.route('/Books/:bookId')
  .get(function(req, res){
    // 5.1. reading books from MongoDB using mongoose
    Book.findById(req.params.bookId, function(err, book){
      if(err) res.status(500).send(err);
      else res.json(book);
    });
  });


// 6. use the router
app.use('/api', bookRouter);

app.get('/', function(req, res) {
  res.send('Welcome to Api!');
});

// 7. have express start listening to http requests
app.listen(port, function() {
  // this callback function is just to inform us that the app is listening.
  console.log('Running on PORT ' + port);
});
