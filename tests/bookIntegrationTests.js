// bookIntegrationTests.js
var should = require('should');
var request = require('supertest');

// superset needs a reference to 'server.js' to execute the http calls
var app = require('../server.js');

var mongoose = require('mongoose');

// Here I can pull in the book model directly from mongoose
// becasue it is loaded into mongooes inside the 'server.js'
// so I don't need to go through the hassel of pulling it in from the model
var Book = mongoose.model('Book');

// Use Supertest Agent to  execute teh http calls
var agent = request.agent(app);


// The rest of integration test implementation is very Similar to unit test implementation
describe('Book CRUD Test', function(){
    it('Should allow a book to be posted and a return a read and _id', function(done){
        // Create a Book
        var bookPost = {title: 'new book', author:'John', genre:'Fiction'};

        // Post a request to '/api/books'
        // Send the book object as part of the request body
        // In response, expect a 200
        // At the end, the return object should contain the 'read' and '_id' properties
        // Then do the assertions
        // Then call done callback function, to let supertest knwo this test is done, so move on to the next thing (afterEach)
        agent.post('/api/books')
            .send(bookPost)
            .expect(200)
            .end(function(err, results){
                results.body.read.should.equal(false);
                results.body.should.have.property('_id');
                done();
            });
    });

    // When all of our tests is done, run a function to cleat the the test database
    afterEach(function(done){
        Book.remove().exec();
        
        // Run done  callback to let everyone we are all done and everything is good
        done();
    });
});