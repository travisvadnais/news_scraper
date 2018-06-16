//Set up the required packages
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//Set up scraping tools - reminds me of the dentist
var axios = require("axios");
var cheerio = require("cheerio");

//Pull in the models
var db = require("./models");

var PORT = 3000;

//========= Configure all the Express stuff =======================//

//Get Express rocking
var app = express();

//Morgan will log requests
app.use(logger("dev"));
//BodyParser will handle form submissions
app.use(bodyParser.urlencoded({extended: true}));
//Serve public folder as static directory
app.use(express.static("public"));

//====================== End Express Stuff ========================//

//Link up w/ MongoDB
mongoose.connect("mongodb://localhost/news_scraper");

//================== Set Up Routes ===============================//


//================== End Routes =================================//


//Start Server
app.listen(PORT, function() {
    console.log(`You launched port: ${PORT}!`)
})