// Routes

var express = require("express");
var router = express.Router();
// Require all models
// var db = require("../models");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");



router.get("/", function (req, res) {
    Article.find({ "saved": false }, function (error, data) {
        var hbsObject = {
            article: data
        };
        res.render("index", hbsObject);
    });
});

router.get("/saved", function (req, res) {
    Article.find({ "saved": true }).populate("note").exec(function (error, article2) {
        var hbsObject = {
            article: article2
        };
        console.log(hbsObject);
        res.render("saved", hbsObject);
    });
})


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
            Article.create(result)
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
    Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

router.get("/api/getarticles/:id", function (req, res) {
    // Grab every document in the Articles collection
    Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


//Save an article
router.post("/api/savearticle/:id", function (req, res) {
    Article.findByIdAndUpdate({ _id: req.params.id }, { saved: true })
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

router.get("/api/savenote/note/:id", function(req, res) {
	var id = req.params.id;
	Article.findById(id).populate("note").exec(function(err, data) {
		res.send(data.note);
	})
})

router.post("/api/savenote/:id", function (req, res) {
    var note = new Note(req.body);
	note.save(function(err, doc) {
		if (err) throw err;
		Article.findByIdAndUpdate(req.params.id, {$set: {"note": doc._id}}, {new: true}, function(err, doc) {
			if (err) throw err;
			else {
				res.send(doc);
			}
		});
    });
});
// Export routes for server.js to use.
module.exports = router;