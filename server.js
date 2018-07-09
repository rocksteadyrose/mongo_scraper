var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var exphbs = require("express-handlebars");
var path = require("path");

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

// We set this as the view engine bc Handlebars is controlling what the users see
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongo_scraper");

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});


// Routes
// Require all models
// var db = require("../models");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

app.get("/", function (req, res) {
  Article.find({ "saved": false }, function (error, data) {
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
app.get("/api/getarticles", function (req, res) {
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

app.get("/api/getarticles/:id", function (req, res) {
  // Grab every document in the Articles collection
  Article.findOne({ _id: req.params.id })
    .populate("note")
    // now, execute our query
    .exec(function (error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise, send the doc to the browser as a json object
      else {
        res.json(doc);
      }
    });
});


//Save an article
app.post("/api/savearticle/:id", function (req, res) {
  // Use the article id to find and update its saved boolean
  Article.findOneAndUpdate({ _id: req.params.id }, { "saved": true })
    // Execute the above query
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

//Delete a saved article
app.post("/api/deletesavearticle/:id", function (req, res) {
  // Use the article id to find and update its saved boolean
  Article.findOneAndUpdate({ _id: req.params.id }, { "saved": false })
    // Execute the above query
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

app.get("/api/savenote/note/:id", function (req, res) {
  var id = req.params.id;
  Article.findById(id).populate("note").exec(function (err, data) {
    res.send(data.note);
  })
})

//Create a new note
app.post("/api/savenote/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note({
    body: req.body.text,
    article: req.params.id
  });
  console.log(req.body)
  // And save the new note the db
  newNote.save(function (error, note) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's notes
      Article.findOneAndUpdate({ _id: req.params.id }, {$push: { note: note }})

      // Execute the above query
      .exec(function (err) {
        // Log any errors
        if (err) {
          console.log(err);
          res.send(err);
        }
        else {
          // Or send the note to the browser
          res.send(note);
        }
      });
    }
  });
});

