"use strict"

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    db = require('./models/index');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + "/public"));


// HOME
app.get('/', function(req, res){
  res.render('home');
});

app.get('/Authors', function(req, res){
  db.Author.findAll().done(function(err, post) {
    res.render('index', {allPosts: post});
  });
});



// INDEX
app.get('/Posts', function(req, res){
  db.Post.findAll().done(function(err, post) {
    res.render('index', {allPosts: post});
  });
});


// NEW
// get new (form field)
app.get('/Posts/New', function(req, res){
  res.render("new", {title:"", body:""});
});

// post new "Post" and redirect
app.post('/Posts', function(req, res) {
  var title = req.body.post.title;
  var body = req.body.post.body;
  db.Post.create({title: title, body: body})
    .done(function(err, success){
      if (err){
        var errMsg = "Title must be at least 6 characters";
        res.render('/Posts/New', {errMsg: errMsg, title: title, body: body});
      }
      else {
    res.redirect('/Posts');
    }
  });
});


// SHOW
// app.get('/Posts/:id', function(req, res) {
//   res.send("impliment show book. showing book " + req.params.id);
// });


// EDIT
// get to edit particular 'POST'
// put to edit existing


// DELETE
// delete post

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});