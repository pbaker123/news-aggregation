// **********************************
// ********** DEPENDENCIES **********
// **********************************
var bodyParser = require("body-parser"); // Body parser
var exphbs = require('express-handlebars'); // Logicless templating language
var express = require("express"); // Web application frame work
var logger = require("morgan"); // HTTP request logger
var mongoose = require("mongoose"); // MongoDB object modeling tool

// For Express
var app = express();
var PORT = process.env.PORT || 3000;
app.use(express.static("public"));

// For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Handlebars
app.engine('handlebars', exphbs({
	defaultLayout: "main"
}));
app.set('view engine', 'handlebars');

// For Morgan
app.use(logger("dev"));

// For Mongoose
var MONGOPORT = 27017;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:" + MONGOPORT + "/newsHeadlines";
var URL_PARSER = { useNewUrlParser: true };
mongoose.connect(MONGODB_URI, URL_PARSER)
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

// ****************************
// ********** MODELS **********
// ****************************
var models = require("./models");

// ***************************
// ********** ROUTES *********
// ***************************
require('./routes/apiroutes.js')(app);
require('./routes/htmlroutes.js')(app);

//////////////////////////////////
////////// Start Server //////////
//////////////////////////////////
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
