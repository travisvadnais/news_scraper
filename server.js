//Set up the required packages
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
var logger = require("morgan");
var mongoose = require("mongoose");
var allRoutes = require("./routes/routes.js");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";



//========= Configure all the Express stuff =======================//

//Morgan will log requests
app.use(logger("dev"));
//BodyParser will handle form submissions
app.use(bodyParser.urlencoded({extended: true}));
//Serve public folder as static directory
app.use(express.static("public"));
app.use('/', allRoutes);

//====================== End Express Stuff ========================//

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI).catch(err => console.log(err));

//Link up w/ MongoDB
mongoose.connect("mongodb://localhost/news_scraper");

//Start Server
app.listen(PORT, function() {
    console.log(`You launched port: ${PORT}!`)
})