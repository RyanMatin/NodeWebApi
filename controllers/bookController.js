// bookController.js

// 1. create bookController using "revealing module pattern""
var bookController = function(Book) {

    // 3
    var post = function(req, res) {
            // prepare a book instance from bod-parse json
            // Book is the mongoose model that does all of the database work for us
            // We should not create a new instance of the Book inside our controller
            // Because we want to mock that later for our unit tests. so we pass Book
            // into the controller when it's first created.
            var book = new Book(req.body);

            // save the boko in DB
            book.save();
            
            // send back status 201 (created) and saved book (with generated _id)
            // res.status(201).send(book);

            // since this is not working with mocking framework, we need to make seperate calls to status and send.
            res.status(201);
            res.send(book);
        };

    // 4
    var get = function(req, res){
            // Sanitized Query: Only querying by genre
            var query = {};
            if(req.query.genre) {
                query.genre = req.query.genre;
            }

            // reading books from MongoDB using mongoose
            Book.find(query, function(err, books){
                if(err){
                    res.status(500).send(err);
                    //console.log(err);
                }
                //else res.json(books);
                else {
                    // Including HATEOAS link to each book. so we need a new Array to push on the modified books
                    var returnBooks = [];
                    books.forEach(function(element, index, array){
                        // The objects that we are getting back from MongoDB are mongoose models,
                        // so we can't do it just straight like this, we actually have to create a newBook and 
                        // copy the element over, and if we do .toJSON that will actually do what we're looking for.
                        // It'll strip out all of the Mongoose stuff and just leave us with the JSON object that we can then start to edit.
                        var newBook = element.toJSON();

                        // Create a new section on the newBook called links to at HATEOAS hyperlinks
                        newBook.links = {};
                        newBook.links.self = 'http://' + req.headers.host + '/api/books/' + newBook._id;

                        // push the newBook to the modified list
                        returnBooks.push(newBook);
                    })
                    res.json(returnBooks);
                }
            });
        };        
    
    // 5
    return {
        post: post,
        get: get
    };
}

// 2
module.exports = bookController;
