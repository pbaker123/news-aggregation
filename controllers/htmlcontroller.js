// **********************************
// ********** DEPENDENCIES **********
// **********************************
var request = require("request"); // Simplified HTTP request client
var cheerio = require("cheerio"); // Implements a subset of core jQuery
var db = require("../models"); // Imports database models

// *********************************
// ********** Controllers **********
// *********************************
var exports = (module.exports = {});

// *******************************************
// ********** GET Route Controllers **********
// *******************************************
exports.home = function(req, res) {
	// Sample data returned: update once it has notes
	//	[
	//		{
	// 			"_id": "5b6d983c0aa76b24847cdc5e",
	// 			"title": "Trump renews attacks on NFL players after preseason protests",
	// 			"url": "https://www.reuters.com/article/us-football-nfl-anthem/trump-renews-attacks-on-nfl-players-after-preseason-protests-idUSKBN1KV1KA",
	// 			"summary": "President Donald Trump on Friday renewed his attacks on NFL players pushing for criminal justice and other social reforms as U.S. media reported a number of players reportedly protested during the league's preseason opening late on Thursday.",
	// 			"__v": 0
	// 		}, ...
	//	]
	db.Article.find({}).then(function(dbArticle) {   
		var articles = { article: dbArticle};
    res.render("home", articles); // If we were able to successfully find Articles, render the home handlebar with the data in dbArticle (see sample data above)
  }).catch(function(err) {
    res.json(err); // If an error occurred, send it to the client
  });
};

exports.scrape = function(req, res) { 
  request('https://www.reuters.com/news/us', function (err, res, body) {  // Collect the body of the html with request
  	if (err) {
      return console.error('upload failed:', err); // Print the error if one occurred
    };
	  console.log('statusCode:', res && res.statusCode); // Print the response status code if a response was received
	  var $ = cheerio.load(body); // Load the body into cheerio and save as $ for a short hand selector
	  $("div.FeedItem_item").each(function(i, element) {
	  	var result = {}
	  	result.title = $(this).find("h2.FeedItemHeadline_headline").children("a").text(); // Grabs the Title
	  	result.url = $(this).find("h2.FeedItemHeadline_headline").children("a").attr().href; // Grabs the URL
	  	result.summary = $(this).find("p.FeedItemLede_lede").text(); // Grabs the Summary
	  	db.Article.find({ url: result.url }) // Check to see if the URL already exists in the database
	  	.then(function(dbArticle) {
	  		if (dbArticle.length === 0) { // If the URL does not exist the returned array is empty (length 0), so we know to add the new article to our database
	  			db.Article.create(result) // Add the result object to the database
      		.catch(function(err) {
		        res.json(err); // If an error occurred, send it to the client
      		});
      	};
      }).catch(function(err) {
	      res.json(err); // If an error occurred, send it to the client
	    });
	  });
	});
	res.send("scraped");
};

exports.delete = function(res) {
	console.log("deleting")
	db.Article.remove({}).exec().then(function(){
		return;
	});
};

exports.saved = function(req, res) {
	db.Article.find({ saved: true }).then(function(dbArticle) {
		var articles = { article: dbArticle};
		res.render("saved", articles); // If we were able to successfully find Articles, render the home handlebar with the data in dbArticle (same sample data as home())
		}).catch(function(err) {
    res.json(err); // If an error occurred, send it to the client
  });
};

exports.notes = function(req, res) {
	db.Article.find({ "_id": req.params.id }).populate("notes").then(function(dbArticle) {	
    res.json(dbArticle[0].notes);
  }).catch(function(err) {
    res.json(err); // If an error occurred, send it to the client
  });
};

exports.deletenote = function(req, res) {
	db.Note.remove({ "_id": req.params.id }).then(function() {
		res.send("deleted")
	});
};

// ********************************************
// ********** POST Route Controllers **********
// ********************************************
exports.save = function(req, res) {
	db.Article.findOneAndUpdate({ _id: req.body._id }, { saved: req.body.saved, unsaved: req.body.unsaved }, { new: true })
	.then(function() {
		res.redirect("/");
	})
};

exports.postNote = function(req, res) {
	db.Note.create( { note: req.body.note }).then(function(dbNote) {
    return db.Article.findOneAndUpdate({ _id: req.body.id }, { $push: { notes: dbNote._id } }, { new: true });
  }).catch(function(err) {
    res.json(err);
  });
  res.send("added")
};