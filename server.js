// 1. create a reference to express
var express = require('express');

// =================================
// 1.1. create a refernce to Mongoose
var mongoose = require('mongoose');

// 1.2. conenct to MongoDB database (bookAPI). It create DB if not exists. 
//var db = mongoose.connect('mongodb://localhost/bookAPI');

// 1.2. New way fo integration testing (when env == TEST)
var db;
if(process.env.ENV == 'Test') {
  // at runtime mongoose see that bookAPI_test does not exist, so it creates it for us
  db = mongoose.connect('mongodb://localhost/bookAPI_test');
}
else {
  db = mongoose.connect('mongodb://localhost/bookAPI');
}

// 1.3. Translate the MongoDB data into a model
var Book = require('./models/bookModel');
// =================================


// 2. create  an instance of express to start running our stuff
var app = express();

// 3. setup a port (way#1 using environment process)
var port = process.env.PORT || 3000;


// 1.4. Body Parser middleware allows Express to read the body of Http request and parse that into a JSON object
// $ npm install body-parser - -save
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// 6. use the router (inject the Book to the router instead of adding a require statment in it)
var bookRouter = require('./routes/bookRoutes')(Book);
app.use('/api/books', bookRouter);
// app.use('/api/authors', authorRouter);

app.get('/', function(req, res) {
  res.send('Welcome to Api!');
});

// 7. have express start listening to http requests
app.listen(port, function() {
  // this callback function is just to inform us that the app is listening.
  console.log('Running on PORT ' + port);
});


// 8. export the app object in order to allow supertest to execute our app (for integration testing)
module.exports = app;