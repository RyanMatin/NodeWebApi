// 1. create a reference to express
var express = require('express');

// 2. create  an instance of express to start running our stuff
var app = express();

// 3. setup a port (way#1 using environment process)
var port = process.env.PORT || 3000;

// 4. setup a handler for a route
app.get('/', function(req, res) {
  res.send('Welcome to Api!');
});

// 5. have express start listening to http requests
app.listen(port, function() {
  // this callback function is just to inform us that the app is listening.
  console.log('Running on PORT ' + port);
});
