const express = require('express');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express();

// Map global promise - get rid of warning in mongodb for promises
mongoose.Promise = global.Promise;

// Connect to mongoose(It can be local or remote)
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(()=>{
  console.log('MongoDB Conencted..')
})
.catch(err=> console.log(err))


// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');


// Handlebars middlewares - This will tell the system that we want to use handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// Body Parse middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method override middleware
app.use(methodOverride('_method'))

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

// Idea Index Page
app.get('/ideas', (req, res)=>{
  Idea.find({})
  .sort({date:'desc'})
  .then(ideas =>{
    res.render('ideas/index',{
      ideas: ideas
    });
  })
})

// Add idea form
app.get('/ideas/add',(req, res)=>{
  res.render('ideas/add')
})

// Edit idea form
app.get('/ideas/edit/:id',(req, res)=>{
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit',{
      idea:idea
    })
  })
  
})

// Process form 
app.post('/ideas',(req, res)=>{
  console.log(req.body);

  let errors = [];
  if(!req.body.title){
    errors.push({
      text: 'Please add a Title'
    })
  }

  if(!req.body.details){
    errors.push({
      text: 'Please enter some details'
    })
  }

  if(errors.length > 0){
    res.render('ideas/add',{
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  }else{
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
    .save()
    .then(idea =>{
      res.redirect('/ideas')
    })
  }

})

// Edit Form Process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        res.redirect('/ideas')
      })
  })
})

// Delete Idea
app.delete('/ideas/:id', (req, res) => {
  Idea.remove({
    _id: req.params.id
  })
  .then(()=>{
    res.redirect('/ideas')
  })
})


const port = 5000;

app.listen(port, ()=>{
  console.log(`Server started on ${port}`);
});