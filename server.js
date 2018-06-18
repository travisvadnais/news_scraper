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

//Scrape route
app.get("/scrape", function(req, res) {
    //Set up the website to scrape.  Yes we're going w/ #realnews . . . Reddit
    axios.get("https://www.reddit.com/r/The_Donald/").then(function(response) {
        //Shoot the page into Cheerio
        var $ = cheerio.load(response.data);

        //Reddit doesn't have consistent classes until down into the H2 element, so grab that
        $("h2.k202r0-0").each(function(i, element) {
            
            //Set up the object for the document to go in the collection
            var result = {}
            //Reddit keeps off the www.reddit.com on their hrefs, so we'll neeed to account for that
            //Grab the link they DO provide and store it in a variable
            var truncated_link = $(this).parent("a").attr("href");

            //Grab the title (which just so happens to be in the H2 we referenced above)
            result.title = $(this).text();
            //Then assemble the rest of the link w/ interpolation
            result.link = `https://www.reddit.com${truncated_link}`;

            //Shoot it into the DB
            db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    return res.json(err)
                });
        });
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection that hasn't been saved
    db.Article.find({
        saved: false
    })
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.get("/saved", function(req, res) {
    db.Article.find({
        saved: true
    })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
})

//=================Route to add a page to Favorites=====================//

    //It'll be a post route taking in the ID
    app.post("/add_fave/:id", function(req, res) {
        //Store the ID in a variable
        var articleId = req.params.id;
        console.log(articleId);
        //Mongoose function will search via ID and change 'saved' to 'true'
        db.Article.findOneAndUpdate({_id: articleId}, {saved: true})
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err)
            })
    });

    //Same route as above, essentially - just removing from faves instaed of adding
    app.post("/remove_fave/:id", function(req, res) {
        var articleId = req.params.id;
        console.log(articleId);
        db.Article.findOneAndUpdate({_id: articleId}, {saved: false})
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err)
            })
    });

    app.post("/add_note/:id", function(req, res) {
        console.log(req.body);
        db.Note.create(req.body)
            .then(function(dbNote) {
                return db.Article.findOneAndUpdate({_id: req.params.id }, { note: dbNote._id }, {new: true});
            })
            .then(function(dbArticle) {
                res.json(dbArticle)
            })
            .catch(function(error) {
                res.json(error)
            })
    });
//=============== End Favorites Route ===========================//


//================== End Routes =================================//


//Start Server
app.listen(PORT, function() {
    console.log(`You launched port: ${PORT}!`)
})