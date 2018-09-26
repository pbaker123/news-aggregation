// **********************************
// ********** DEPENDENCIES **********
// **********************************
const request = require("request"); // Simplified HTTP request client
const cheerio = require("cheerio"); // Implements a subset of core jQuery
const db = require("../models"); // Imports database models

// *********************************
// ********** Controllers **********
// *********************************
module.exports = {

// *******************************************
// ********** GET Route Controllers **********
// *******************************************
	home: (req, res) => { //Works
		db.Article
			.find()
			.then((dbArticle) => res.render("home", { article: dbArticle }))
			.catch((err) => res.json(err));	
	},

	scrape: (req, res) => {
	  request('https://www.reuters.com/news/us', (err, res, body) => {
	  	if (err) {
				return console.log('upload failed:', err);
			}		  
		  const $ = cheerio.load(body);
		  $("div.FeedItem_item")
		  	.each(function (i, element) {
			  	const result = {
			  		title: $(this)
			  			.find("h2.FeedItemHeadline_headline")
							.children("a")
							.text(),
			  		url: $(this)
			  			.find("h2.FeedItemHeadline_headline")
							.children("a")
							.attr()
							.href,
			  		summary: $(this)
			  			.find("p.FeedItemLede_lede")
							.text()
			  	};
		  		db.Article
		  			.find({ 
		  				url: result.url 
		  			})
		  			.then((dbArticle) => {
		  				if (dbArticle.length === 0) {
		  					db.Article
		  						.create(result)
	      					.catch((err) => res.json(err)); 			
							};
						})
	      		.catch((err) => res.json(err));   	
				});
		});
		res.send("scraped");
	},

	saved: (req, res) => { //Works
		db.Article
			.find({ 
				saved: true 
			})
			.then((dbArticle) => res.render("saved", { article: dbArticle }))
			.catch((err) => res.json(err));
	},

	notes: (req, res) => {
		db.Article
			.find({ 
				"_id": req.params.id 
			})
			.populate("notes")
			.then((dbArticle) => res.json(dbArticle[0].notes))
	  	.catch((err) => res.json(err));	
	},

// ********************************************
// ********** POST Route Controllers **********
// ********************************************
	save: (req, res) => {
		db.Article
			.findOneAndUpdate({ 
					_id: req.body._id 
				}, { 
					saved: req.body.saved, 
					unsaved: req.body.unsaved 
				}, { 
					new: true 
				})
			.then(() => res.redirect("/"))
			.catch((err) => res.json(err));
	},

	postNote (req, res) {
		db.Note
			.create({ 
				note: req.body.note 
			})
			.then((dbNote) => {
				db.Article
					.findOneAndUpdate({ 
						_id: req.body.id 
						}, { 
							$push: { 
								notes: dbNote._id 
							} }, { 
						new: true 
					})
					.catch((err) => res.json(err))	  
			});
	  res.send("added");
	},

// **********************************************
// ********** DELETE Route Controllers **********
// **********************************************
	delete: (res) => {
		db.Article
			.remove()
			.exec()
			.then(() => res.render("home"))
			.catch((err) => res.json(err));
	},

	deletenote: (req, res) => {
		db.Note
			.remove({ 
				"_id": req.params.id 
			})
			.then(() => res.status(200))
			.catch((err) => res.json(err));
	}
};
