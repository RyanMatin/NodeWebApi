// 1. create a refernce to mongoose
var mongoose = require('mongoose');

// 2. create a mongoose schema instance
var Schema = mongoose.Schema;

// 3. define the schema of your model
var bookModel = new Schema({
    title: { type: String },
    author: { type: String },
    genre: { type: String },
    read: { type: Boolean, default: false }
});

// 4. export the model (load your model into MongoDB and name it properly)
// this tells mongoose that we have a new model/schema called Book.
module.exports = mongoose.model('Books', bookModel);