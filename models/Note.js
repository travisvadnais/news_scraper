var mongoose = require("mongoose");

//Party with the Schema constructor
var Schema = mongoose.Schema;

//Construct a new Schema / collection for notes
var NoteSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

//Create the model and save it to 'Note'
var Note = mongoose.model("Note", NoteSchema);

//Fire that baby off
module.exports = Note;