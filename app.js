const express = require('express');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Map global promise - get rid of warning in mongodb for promises
mongoose.Promise = global.Promise;

// Connect to mongoose(It can be local or remote)
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(()=>{
  console.log('MongoDB Conencted..')
})
.catch(err=> console.log(err))


// Handlebars middlewares - This will tell the system that we want to use handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// Body Parse middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method override middleware
app.use(methodOverride('_method'))

// Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// To connect flash
app.use(flash())

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

// How middleware works:
app.use((req, res, next)=>{
  // console.log(Date.now());
  req.name = 'Radio Heaven' //This req variable can be used globally across our application.
  next();
})

// Index Route
app.get('/',(req, res)=>{
  console.log(req.name)
  const title = "VidJot - PTL: Server"
  res.render('index', {
    title: title
  })
})

// About Page
app.get('/about',(req, res)=>{
  res.render('about')
})


// User Routes
app.use('/ideas', ideas)
app.use('/users', users)


const port = 5000;

app.listen(port, ()=>{
  console.log(`Server started on ${port}`);
});