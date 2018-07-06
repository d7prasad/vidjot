NodeJs&Express_MongoDB App - Notes:

***************** To start this application kindly execute the below after installing the node & Mongodb **************
* To start the service - 
* sudo service mongod start - Execute this in terminal
* nodemon - to start this application with mongoDb connection.

************************************************************************************************************************

* NPM is a runtime engine
* Node works on non-blocking mode, that is while doing a I/O operation, we don't need to wait for it to complete, rather one upload, can continue and we can continue doing something else, until the callback fires on the first I/O operation.
* It's event driven system.
* Just create a test.js(with content - console.log("test"), and type in bash, node test

MongoDB:
Mongose - Module for nodejs
Refer to install mongodb- https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
* Run this command after installing mongodb as described in above step, sudo mongod --directoryperdb --dbpath /data/db --logpath /log/mongo.log --logappendCreate - Create appropriate folders

* To start the service - sudo service mongod start
* TO stop - sudo service mongod stop
* To restart - sudo service mongod restart

* To start a mongo shell in the same host machine
mongo --host 127.0.0.1:27017

CTL+C to terminate the mongod instance while it is running



Express js:
* Express is a web framework.
* Documentation available in expressjs.com

# VidJot - Application Set-up #
---------------------------
* Create Package JSON
$ npm init

* Install express - While installing express when we use --save, it will get attach to the package.json file
$ sudo npm install --save express

* Create a file => app.js
* create all the contents written overthere.
* console.log(`server port ${port}`) => here backticks used, since we can include a variable=>port instead of concatenation.
* To start the app => node app.js (ctrl+c - to terminate) or node app

* Create Basic routing for root / in app.js

## Install nodemon ##
$ sudo npm install -g nodemon - this we install globally, so it will not present in node modules, to view the file we can enter the following
$ npm root -g
$ we can start our application by - $nodemon

* Express as a middleware - important functionality to be used by passport
* app.use((req, res, next)=>{
  req.name = 'Radio Heaven' // This can be used any where in our application globally, same technique we gonna use it for our user authentication, take the user session from login, and put it here, and validate on other areas.=>This will work on every route we do
})

* Template Engine - express Handlebars(Refer official GitHub page for commands): We can render our views using template engines itself inside express, instead of putting our files in Angular or React.
$ sudo npm install express-handlebars --save 
* var exphbs  = require('express-handlebars');
* And set the middlewares for -  express handlers
* Now for the routes e.g:(/), change the res.send to res.render('index') => This will render index.handlebars ->This will look for index.html inside /views -> So create one.
* Also we need to create a layout inside views->layouts/main.handlebars - This like wrapaorunds all our views, common code like doctype, imports, meta-tags can be written here. so go ahead and create one.
* Insert all the view inside main.handlebars with {{{body}}}, so routes should work perfectly now.
* To pass dynamic data from backend to views, inside route code, const title = "welcome"; res.render('index', {title: title}) - Use {{title}} in any handlebars to access the serverside code


* Introduction to Bootstrap in index.handlebars
* copy the cdn and paste in layout/main
* Insert the js ref also at the bottom of the main
* Insert navbar, later move that to partials, to clean up main - {{> _navbar}}


------------- Day-2 ---------------
* Integeration this application with Mongo-DB:(Kindly install mongo local db as a service as mentioned above as a first step & continuet this)
* Install mongoose - npm install --save mongoose
* in app.js create const mongoose  = require('mongoose')
* mongoose.connect('mongodb://localhost/vidjot/dev',{useMongoClient: true})
* To start the service - sudo service mongod start - Execute this in terminal && execute nodemon to start this application with mongoDb connection.

* Create Models for Mongodb:
* Create schema in our application
* create models folder & the files - with first letter as Caps (Idea.js) - It's a good practise for models to capitalize the first letter.
* Bring the created model(Idea.js) inside app.js

 ## Create Idea and save that to MongoDB ##

* Create add idea option in the menubar
* Add route to '/ideas/add' in app.js
* Create 'ideas' folder -> add.handlebars
* We can create form with post request, method put and delete is not possible with HTML forms, instead, we have to create method override

* AddIdea should navigate to /ideas page:
* Will do some servide validation here for add idea page.
* First, create route for /ideas in app.js
* Inside that, we need to use 'bodyparts'(thirparty module) to catch values from form entered
* Install it(npm install --save body-parser), require it, two lines of middleware dependency code.
* Paste this two lines - Took from https://www.npmjs.com/package/body-parser

## parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
## parse application/json ##
app.use(bodyParser.json())
* BodyParser helps us to access the req object using req.body

## Validation ##
* We can have client side validation e.g: required in text filed, but keeping a server side validation is always good.
* Server side validation starts inside app.post('/ideas') - route handler
* Now in add.handlebars, loop through the errors using {{#each errors}} with div alert alert-danger

## Save values into MongoDB from /ideas/add form ##
* In  the else part of app.post('/ideas') after succesfull validation, save the contents using Ideas.schema into MongoDB
* Now execute this in $ terminal to enter into mongodb instance - mongo --host 127.0.0.1:27017
* $ show dbs - to list our newly created db's 'vidjot-dev'
* $ use vidjot-dev - switch to our db
* $ show collections -> ideas(Which is the model, we already created in app.js)
* $ db.ideas.find() -> This will list all the list of ideas which we entered.

## Fetching values from MongoDB ##
* Create route for /ideas page in app.js
* Also use Idea.find({}) - pass empty, since we want to fetch all, and .sort by date field, and pass ideas(collection) to the view.
* Now loop through the ideas in index.handlebars

## Edit the ideas & Delete -- Here we are going to use put & delete method, so we have to use Method override to make it work in the simple form ##

* Create route for /ideas/edit page by passing the id as a param
* Add edit button in ideas/index.handlebars by passing in the id param
* in /ideas/edit route, fetch the particular idea from db with the id and display it in the edit page
* While fetching the idea, we are using 'findOne' since we are gonna fetch one idea only.
* The edit page should look like add page, so copy everything from add page and make change.

* In order to use put request to update a req, we cannot use the sample form simply, instead we can use method override.
* Add app.put method request in app.js
* npm install --save method-override
* var methodOverride = require('method-override')
* Add middleware
* // override with the X-HTTP-Method-Override header in the request
* app.use(methodOverride('X-HTTP-Method-Override'))
* Under form submit, make it as a Post, but in action use =/resource?_method=DELETE
* And add a hidden element in the page for _method (E.g: <input type="hidden" name="_method" value="PUT">)
* Complete app.put method now, with updation of ideas.


## Delete a idea ##

* Add a delete button under ideas/index.handlebars
* Handle the rourting for app.delete in app.js


##  Express session handling & Flash message ##
$ sudo npm install express-session connect-flash --save
$ Bring in the dependencies in app.js using const session = require('express-session')
* Add express-session middleware app.use(session.. )
* Change the secret keyword and delete cookie attribute.
* To connect flash - app.use(flash())
* set global variables middleware in app.use, res.locals.success_msg, res.locals.error_msg, res.local.error
* Create a new partials for output a message or output (under partials - _msg.handlebars)
* Include the partials in main.layout under body, {{> _msg}}
* Now add the flash message inside all the crud operation in app.js.

## Authentication - PassportJS ##

* Create Login route, registration route in app.js(app.get('/user/login')).

### Seperate the routes from app.js into seperate routes folder -> routes/ideas,user
* Link the ideas.js to app.js, for app.js (Deleted all /ideas in ideas.js)
* in app.js - const ideas = require('./routes/idea')
* Also Use those routes at the bottom for the respective routing.
// User Routes
app.use('/ideas', ideas)
app.use('/users', users)

## Make use of public folder in Express ##
* create public folder in root.
* Place Css & Images in public folder
* in app.js -> import express module -> const path = require('path')
* app.use(express.static(path.join(__dirname, 'public')))



## Day 3: User Registration - Form ##

* Create 'users' folder under 'views', and create two files 'login.handlebars' & 'register.handlebars'
* Create User model, like idea, under /models
* Now, we need to encrypt/decrypt the password entered in the view using bcrypt.js
* sudo npm install --save bcryptjs & sudo npm install --save passport
* Handle Post request from login/register.handlebars in routes/users.js
* Handle server side validation for login registration form under routes/users.js

### User form validation is done, now gonna encrypt/decrypt password ###

* Upon Successfull registration, User details will be stored in DB now, but before that lets encrypt the passwords
* Create const in user.js -> const passport & const bcrypt
* create 'newUser' object in 'users/register' after successfull validation -> user.js
* create bcrypt.genSalt() and .hash()
* After hashing the password, save the user into the user object
