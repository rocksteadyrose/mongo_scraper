# Mongo Scraper - HuffPost Dogs Edition

View the completed site on Heroku <a href="http://rose-mongoscraper.herokuapp.com" target="blank">here</a>.

Mongo Scraper is a web app that lets users view and leave comments on the latest (dog) news. Whenever a user visits the app, it scrapes stories from HuffPost Dogs and display them for the user. Each scraped article is saved to the application database using Mongo + Mongoose.

<img width="890" alt="screen shot 2018-07-13 at 7 11 28 pm" src="https://user-images.githubusercontent.com/34491285/42718675-9e7ba9fa-86d0-11e8-8cbf-738672f4e9f6.png">
<img width="1005" alt="screen shot 2018-07-13 at 6 53 25 pm" src="https://user-images.githubusercontent.com/34491285/42718591-eaead4a6-86cf-11e8-9940-3e52b0c54dd2.png">

**HOW TO USE:**

* **ON THE MAIN PAGE:** 

  * You can either hit SCRAPE to get new articles to add to the database, or you can view existing ones already on the site. You can also choose to delete all of the articles from the site using the DELETE ALL BARKICLES button.
  * If you see an article you like, you can click it to read the whole story on HuffPost Dogs.
  * You can also hit SAVE BARKICLE to save it to the SAVED BARKICLES page, or DELETE BARKICLE to delete it from the page.
  
* **ON THE SAVED BARKICLES PAGE:**
  * Here you can view all of the articles you've saved. You can also delete an article from this page, or add notes to each article (or remove them).
 
**Technologies Used:**
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
