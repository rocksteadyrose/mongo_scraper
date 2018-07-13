var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var exphbs = require("express-handlebars");
var path = require("path");
var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;

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

require("./controllers/index.js")(app);
require("./controllers/ArticleandNotes.js")(app);

app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongo_scraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:" + PORT);
});