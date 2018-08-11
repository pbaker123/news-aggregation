// **********************************
// ********** DEPENDENCIES **********
// **********************************
var htmlController = require("../controllers/htmlcontroller.js");

// ***************************
// ********** ROUTES *********
// ***************************
module.exports = function(app) {
  // ********************************
  // ********** GET Routes **********
  // ********************************
  app.get('/', htmlController.home); // Route to return all scraped articles
  app.get('/scrape', htmlController.scrape); // Route to scrape Rueters US News page
  app.get('/delete', htmlController.delete); // Route to delete all scraped articles
  app.get('/saved', htmlController.saved); // Route to return all saved articles
  app.get('/notes/:id', htmlController.notes); // Route to return a specific articles notes
  app.get('/deletenote/:id', htmlController.deletenote); // Route to delete a specific note

  // *********************************
  // ********** POST Routes **********
  // *********************************
  app.post('/save', htmlController.save); // Route to save an article
  app.post('/notes', htmlController.postNote); // Route to post a note to a specific article
};