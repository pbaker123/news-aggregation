// **********************************
// ********** DEPENDENCIES **********
// **********************************
const bodyParser = require("body-parser"); // Body parser
const exphbs = require('express-handlebars'); // Logicless templating language
const express = require("express"); // Web application frame work
const logger = require("morgan"); // HTTP request logger
const mongoose = require("mongoose"); // MongoDB object modeling tool

// For Express
const app = express();
const PORT = process.env.PORT || 3000;
app
	.use(express
		.static("public"));

// For BodyParser
app
	.use(bodyParser
		.urlencoded({ 
			extended: true 
		}));
app
	.use(bodyParser
		.json());

// For Handlebars
app
	.engine('handlebars', exphbs({
	defaultLayout: "main"
}));
app
	.set('view engine', 'handlebars');

// For Morgan
app
	.use(logger("dev"));

// For Mongoose
const MONGOPORT = 27017;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:" + MONGOPORT + "/newsHeadlines";
const URL_PARSER = { useNewUrlParser: true };
mongoose
	.connect(MONGODB_URI, URL_PARSER)
  .then(() =>  console.log('DB connection succesful'))
  .catch((err) => console.error(err));

// ****************************
// ********** MODELS **********
// ****************************
require("./models");

// ***************************
// ********** ROUTES *********
// ***************************
require('./routes/htmlroutes.js')(app);

//////////////////////////////////
////////// Start Server //////////
//////////////////////////////////
app
	.listen(PORT, () => console.log("App running on port " + PORT + "!"));
