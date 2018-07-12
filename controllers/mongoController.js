var express = require("express");
var router = express.Router();

var request = require('request');
var cheerio = require("cheerio");

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

router.get("/", function (req, res) {
    Article.find({ "saved": false }).limit(20).exec(function (error, data) {
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
    request("https://www.thedodo.com/close-to-home", function (error, response, html) {
        var $ = cheerio.load(html);
        $(".standard-listing__image").each(function (i, element) {
            var result = {};

            result.title = $(this)
                .children("a").children(".standard-listing__caption").children(".standard-listing__title").children(".standard-listing__title-text")
                .text();

            result.summary = $(this)
                .children("a").children(".standard-listing__caption").children(".standard-listing__title").children(".standard-listing__description").children(".standard-listing__subtitle")
                .text();

            result.link = $(this)
                .children("a")
                .attr("href");

            Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });
        });
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
router.get("/api/getarticles", function (req, res) {
    Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//Delete all articles
router.delete("/api/deletearticles/", function (req, res) {
    Article
        .remove({})
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
});

//Get an article
router.get("/api/getarticles/:id", function (req, res) {
    Article.findOne({ _id: req.params.id })
        .populate("note")
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
            }
            else {
                res.json(doc);
            }
        });
});

//Delete an article
router.delete("/api/deletearticle/:id", function (req, res) {
    Article
        .remove({ _id: req.params.id })
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
});


//Save article
router.post("/api/savearticle/:id", function (req, res) {
    Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(doc);
            }
        });
});

//Delete saved article
router.delete("/api/deletesavearticle/:id", function (req, res) {
    Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(doc);
            }
        });
});

//Get notes
router.get("/api/savenote/:id", function (req, res) {
    var id = req.params.id;
    Article.findById(id).populate("note").exec(function (err, data) {
        res.send(data.note);
    })
})

//Create a new note
router.post("/api/savenote/:id", function (req, res) {
    var newNote = new Note(req.body);
    newNote.save(function (error, newnote) {
        console.log(newNote)
        if (error) {
            console.log(error);
        }
        else {
            Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: newnote._id } }, { new: true })

                .populate('note')

                .exec(function (err, doc) {
                    if (err) {
                        console.log("Error.");
                    } else {
                        res.send(newnote);
                    }
                });
        }
    });


});


//Delete a note
router.delete("/api/deletenote/:id", function (req, res) {
    Note
        .remove({ _id: req.params.id })
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
});

//Delete a saved article
router.post("/api/deletesavearticle/:id", function (req, res) {
    Article.findOneAndUpdate({ _id: req.params.id }, { "saved": false })
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(doc);
            }
        });
});

// Export routes for server.js to use.
module.exports = router;