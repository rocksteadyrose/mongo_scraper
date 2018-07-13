var Article = require("../models/Article.js");
var express = require("express");
var app = express(app);
var Note = require("../models/Note.js");


module.exports = function (app) {

    //Handlebars 'get' unsaved articles - render index page
    app.get("/", function (req, res) {
        Article.find({ saved: false }).sort({ _id: -1 }).limit(30).exec(function (error, data) {
            var hbsObject = {
                article: data
            };
            res.render("index", hbsObject);
            console.log(hbsObject)
        });
    });

    //Handlebars 'get' saved articles - render saved page
    app.get("/saved", function (req, res) {
        Article.find({ saved: true }).populate("note").exec(function (error, article2) {
            var hbsObject = {
                article: article2
            };
            res.render("saved", hbsObject);
            console.log(hbsObject)
        });
    })
    // Route for getting all Articles from the db
    app.get("/api/getarticles", function (req, res) {
        Article.find({})
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    //Delete all articles
    app.delete("/api/deletearticles/", function (req, res) {
        Article
            .remove({})
            .then(function (dbArticle) {
                res.json(dbArticle)
            })
    });

    //Get an article
    app.get("/api/getarticles/:id", function (req, res) {
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
    app.delete("/api/deletearticle/:id", function (req, res) {
        Article
            .remove({ _id: req.params.id })
            .then(function (dbArticle) {
                res.json(dbArticle)
            })
    });


    //Save article
    app.post("/api/savearticle/:id", function (req, res) {
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
    app.delete("/api/deletesavearticle/:id", function (req, res) {
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

    app.get("/api/savenote/:id", function (req, res) {
        var id = req.params.id;
        Article.findById(id).populate("note").exec(function (err, data) {
          res.send(data.note);
        })
      })
      
      //Create a new note
      app.post("/api/savenote/:id", function (req, res) {
        var newNote = new Note({
          body: req.body.text,
          date: req.body.created,
          article: req.params.id
        });
        console.log(req.body)
        newNote.save(function (error, note) {
          if (error) {
            console.log(error);
          }
          else {
            Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: note } })
      
              .exec(function (err) {
                if (err) {
                  console.log(err);
                  res.send(err);
                }
                else {
                  res.send(note);
                }
              });
          }
        });
      });
      
      //Delete a note
      app.delete("/api/deletenote/:id", function (req, res) {
        Note
          .remove({ "_id": req.params.id })
          .then(function (dbArticle) {
            res.json(dbArticle)
          })
      });
      
      //Delete a saved article
      app.post("/api/deletesavearticle/:id", function (req, res) {
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
}