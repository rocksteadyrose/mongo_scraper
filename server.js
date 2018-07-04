var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var exphbs = require("express-handlebars");

var PORT = 3000;

// Initialize Express
var app = express();


// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// We set this as the view engine bc Handlebars is controlling what the users see
app.set("view engine", "handlebars");

// Import routes and give the server access to them. This is where all of our express routes are.
var routes = require("./controllers/mongoscraper_controller.js");

app.use(routes);

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongo_scraper");

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});

