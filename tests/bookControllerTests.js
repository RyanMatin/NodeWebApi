// bookControllerTests.js
// assertion framework
var should = require('should'); 

// mocking framework
var sinon = require('sinon'); 

// Don't need to bring in mocha, becuase it runs inside the mocha framework (gulp-mocha)
// mocha lays out very similar to standard TDD style (test driven desgin)
// start with a decribe keyword, and describe what this test is doing, and pass a function
// then chain more describes (post: means we are testing the Post method or bookController)
// then layout each test using 'it' function

describe('Book Controller Tests', function(){
    describe('Post', function(){
        
        // the book controller post function, takes a mongoose Book 
        // and creates and instance of Book from req.body, then save it, 
        // and it does res.status
        // So to mock this, we need to send in a 'mocked Book', 'mocked request', 
        // a 'mocked response', and checking for a status that is coming back that says
        // title is missing.
        it('should not allow an empty title on post', function(){
            // Because javascript is not TypeSafe, it means I don't need to have an object of type book in order to do my test.
            // So I can just create a Book that is just a function that takes a book  and has something called save that 
            // doens not really do anything becausein  bookController  it was just calling save without doint anything specific.
            // we don't need save to work in this case in this test. so it is just an empty function.
            var Book = function(book){
                this.save = function() {};
            }

            // but request and response are not easy to mock. because we want them to really do something.
            // in this case req has to have a body and in this case I pass an author because this test is to
            // see whether or not it throws error when title is not provided
            var req = {
                body: {
                    author: 'Ryan'                
                }
            }

            // response is a bit more difficult because when I look at the bookController Post funciton I 
            // actually have to call a  function on it (status) and I want to know what is 'sent' as part of
            // status and also book. So here I use 'sinon' mocking framework. sinon will create a spy which
            // keep track of what is called, what is called with, how many times being called, etc.
            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            } 

            // This is last part that is added
            // =======================================
            // Now we need to call our controller and see the results.
            // Creating an instance of bookController using require, and pass in the mocked Book
            var bookController = require('../controllers/bookController')(Book);
            bookController.post(req, res);
            // =======================================


            // 400 means bad parameters (ex: title not provided). We also use should asserstion framework.
            // args is an array of each time this funciton is called. so we only care about the first time args[0],
            // and what the arguments were and we only care about the first argument args[0][0]
            res.status.calledWith(400).should.equal(true, 'bad status' + res.status.args[0][0]);

            // check on send to amke sure awe are sending backa  helpful error
            res.send.calledWith('Title is required').should.equal(true);

        })
    })
});



