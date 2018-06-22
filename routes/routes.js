const db = require('../models/index.js');
const request = require('request');
const cheerio = require('cheerio');
const router = require('express').Router();

//================== Set Up Routes ===============================//

//Scrape route
router.get("/scrape", function(req, res) {
    //Set up the website to scrape.  Yes we're going w/ #realnews . . . Reddit
    request("https://www.reddit.com/r/The_Donald/", (error, response, body) => {
        //Shoot the page into Cheerio
        if (error) return console.log(error);
        const $ = cheerio.load(body);
        let documentsToInsert = [];

        //Reddit doesn't have consistent classes until down into the H2 element, so grab that
        $("h2").each(function(i, element) {
            //Set up the object for the document to go in the collection
            let result = {}
            //Reddit keeps off the www.reddit.com on their hrefs, so we'll neeed to account for that
            //Grab the link they DO provide and store it in a variable
            var truncated_link = $(this).parent("a").attr("href");

            //Grab the title (which just so happens to be in the H2 we referenced above)
            result.title = $(this).text();
            //Then assemble the rest of the link w/ interpolation
            result.link = `https://www.reddit.com${truncated_link}`;

            //Reddit's page only uses <h2> tags for their articles AND their home route.
            //Filter out the home route and wrap the DB route in an else{}
            if (result.title === "Welcome to Reddit,") {return}
            else {
                documentsToInsert.push(result);
            }
        });
        //Add all the articles to the DB
        db.Article.insertMany(documentsToInsert.reverse(), {ordered: false, rawResult: false}, (err, docs) => {
            //Send the response to the front end
            res.json({errors: err, results: docs});
        });
    });
});

// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
    // Grab every document in the Articles collection that hasn't been saved
    db.Article.find({
        saved: false
    })
    //Sort the results newest to oldest
    .sort({scraped_at: -1})
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

//Route to get the comments attached to an article
router.get("/comments/:id", function(req, res) {
    var articleId = req.params.id;
    db.Article.find({
        _id: articleId
    })
    .populate('note')
    .then(function(dbComments) {
        let comments = [];
        for (let i = 0; i < dbComments[0].note.length; i++) {
            comments.push(dbComments[0].note[i].body);
        }
        res.json(comments)
    })
    .catch(function(err) {
        res.json(err);
    })
})

//Route to grab all the saved articles
router.get("/saved", function(req, res) {
    db.Article.find({
        //Just grabbing any article w/ the flag set to true
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
    router.post("/add_fave/:id", function(req, res) {
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
    router.post("/remove_fave/:id", function(req, res) {
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

//======================= End Favorites Route ==================================//

    //Add a note to the DB
    router.post("/add_note/:id", function(req, res) {
        console.log(req.body);
        //Create the note 
        db.Note.create(req.body)
            .then(function(dbNote) {
                //Add the note ID to associated Article 'note' key
                return db.Article.findOneAndUpdate({_id: req.params.id }, {$push: {note: dbNote._id }}, {new: true});
            })
            .then(function(dbArticle) {
                res.json(dbArticle)
            })
            .catch(function(error) {
                res.json(error)
            })
    });



//================== End Routes =================================//

module.exports = router;