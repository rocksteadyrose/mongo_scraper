var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var exphbs = require("express-handlebars");
var path = require("path");
var request = require('request');

var PORT = 3000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
app.engine("handlebars", exphbs({
  defaultLayout: "main",
  partialsDir: path.join(__dirname, "/views/layouts/partials")
}));

app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/mongo_scraper");

app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:" + PORT);
});

var cheerio = require("cheerio");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

app.get("/", function (req, res) {
  Article.find({ "saved": false }).limit(35).exec(function (error, data) {
    var hbsObject = {
      article: data
    };
    res.render("index", hbsObject);
  });
});

app.get("/saved", function (req, res) {
  Article.find({ "saved": true }).populate("note").exec(function (error, article2) {
    var hbsObject = {
      article: article2
    };
    console.log(hbsObject);
    res.render("saved", hbsObject);
  });
})


app.get("/scrape", function (req, res) {
  request("https://www.huffingtonpost.com/topic/dogs", function (error, response, html) {
    var $ = cheerio.load(html);
    $(".card__content").each(function (i, element) {
      var result = {};

      result.title = $(this)
        .children(".card__details").children(".card__headlines").children(".card__headline").children(".card__link").children(".card__headline__text")
        .text();

      result.summary = $(this)
      .children(".card__details").children(".card__headlines").children(".card__description")
      .text();

      result.image = $(this)
        .children("a").children(".card__image").children("img")
        .attr("src")

      result.link = $(this)
      .children(".card__details").children(".card__headlines").children(".card__description").children("a")
        .attr("href")

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
  Article.findOneAndUpdate({ _id: req.params.id }, { "saved": true })
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

//Save a note
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