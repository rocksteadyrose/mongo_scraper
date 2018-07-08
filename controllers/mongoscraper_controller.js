// Routes

var express = require("express");
var router = express.Router();
// Require all models
var db = require("../models");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

router.get("/", function (req, res) {
    db.Article.find({ "saved": false }, function (error, data) {
        var hbsObject = {
            article: data
        };
        res.render("index", hbsObject);
    });
});

router.get("/saved", function (req, res) {
    db.Article.find({ "saved": true }, function (error, data2) {
        var hbsObject = {
            article: data2
        };
        res.render("saved", hbsObject);
    });
});


router.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.cnn.com/entertainment").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $(".cd__headline").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.summary = $(this).children(".summary").text();
            result.link = $(this)
                .children("a")
                .attr("href");

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
router.get("/api/getarticles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


// Route for saving/updating an Article's associated Note
router.post("/api/savedarticles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
        // ..and populate all of the notes associated with it
        // .then(function (dbArticle) {
        //     // If we were able to successfully find an Article with the given id, send it back to the client
        //     res.json(dbArticle);
        // })
        // .catch(function (err) {
        //     // If an error occurred, send it to the client
        //     res.json(err);
        // });
        .exec(function (err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            else {
                // Or send the document to the browser
                res.send(doc);
            }
        });
});

// Export routes for server.js to use.
module.exports = router;