# mongo_scraper - HuffPost Dogs Edition

View the completed site on Heroku <a href="http://rose-mongoscraper.herokuapp.com">here</a>.

Mong-Scraper is a web app that lets users view and leave comments on the latest (dog) news. Whenever a user visits this site, the app scrapes stories from HuffPost Dogs and display them for the user. Each scraped article is saved to the application database using Mongoose.

HOW TO USE:

* On the homepage, you can either hit SCRAPE to get new articles to add to the database, or you can view existing ones already on the site. You can also choose to delete all of the articles from the site.

* ON THE MAIN PAGE: If you see an article you like, you can click it to read the whole story on HuffPost Dogs. 
*You can also hit SAVE BARKICLE to save it to the SAVED ARTICLES (Saved Barkicles) page, or DELETE BARKICLE to delete it from the page.

* ON THE SAVED BARKICLES PAGE: Here you can view all of the articles you've saved. You can also delete an article from this page, or add notes to each article.

Technologies Used:
* Handlebars & Express-handlebars
* Node
* Express
* Mongoose & Mongo
* Body-parser
* Cheerio
* Request
* Javascript
* jQuery
* Bootstrap
* HTML
* CSS
