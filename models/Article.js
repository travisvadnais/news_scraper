//Import mongoose
var mongoose = require("mongoose");

//Reference to the schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: String,
    },
    //Add a 'Saved' column.  Not sure if we'll use it yet, but the idea is to allow users to save favorites
    saved: {
        type: Boolean,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

//This will change the 'Saved' field to 'True' when the user wants to save an article
ArticleSchema.methods.setFavorite = function() {
    this.saved = true;
    return this.saved;
};

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;