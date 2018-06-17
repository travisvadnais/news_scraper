var mongoose = require("mongoose");

//Party with the Schema constructor
var Schema = mongoose.Schema;

//Construct a new Schema / collection for notes
var NoteSchema = new Schema({
    title: String,
    body: String
});

//Create the model and save it to 'Note'
var Note = mongoose.model("note", NoteSchema);

//Fire that baby off
module.exports = Note;