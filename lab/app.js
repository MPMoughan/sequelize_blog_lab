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
app.get('/', function (req, res){
  res.render('home');
});

// INDEX for AUTHOR - Shows list of authors
app.get('/Authors', function (req, res){
  db.Author.findAll().done(function(err, author) {
    res.render('Author/index', {allAuthors: author});
  });
});


// NEW
// form field for new author
app.get('/Authors/new', function (req, res){
  res.render("Author/new", {name:"", age:""});
});

// issue of precedence (specific to general)
// post new "author" and redirect
app.post('/Authors', function (req, res) {
  var name = req.body.author.name;
  var age = req.body.author.age;
  db.Author.create({name:name, age:age})
    .done(function(err, success){
      if (err){
        var errMsg = "Name must be at least 6 characters";
        res.render('/Authors/New', {errMsg:errMsg, name:name, age:age});
      }
      else {
    res.redirect('/Authors');
    }
  });
});

// SHOW individual author page with all "Posts"
app.get('/Authors/:id',function (req,res){
  db.Author.find(req.params.id).done(function(err, author){
    author.getPosts().done(function(err,posts){
      res.render('Author/show', {posts:posts, author:author});
    });
  });
});


// EDIT author - direct to edit forms
app.get('/Authors/:id/edit', function (req, res) {
  //find our book
  var id = req.params.id;
  db.Author.find(id).success(function(author){
      res.render('Author/edit', {author: author});
  });
});

// UPDATE author info
app.put('/Authors/:id', function (req, res) {
  var id = req.params.id;
  db.Author.find(id).success(function(author){
      author.updateAttributes
      ({name: req.body.author.name, age: req.body.author.age
      }).done(function(err, success){
      if (err){
        var errMsg = "Title must be at least 6 characters";
        res.render('library/edit', {errMsg:errMsg, author:author});
        // why did you need to go through this
      }
      else {
    res.redirect('/Authors');
      }
    });
  });
});

//DELETE author and all associated posts
app.delete('/Authors/:id', function (req, res) {
  var id = req.params.id;
  console.log("Deleting .. :" + id);

  db.Author.find(id).success(function(author){
      // console.log("Found .. :" + author);
      db.Post.destroy({
        where: {
          AuthorId:author.id
          }
        }).done(function(){
      author.destroy().done(function(){
      res.redirect('/Authors');
      });
    });
  });
});




            /////////// POST ///////////

// INDEX for POST
app.get('/Posts', function (req, res){
  db.Post.findAll({include: [db.Author]}).done(function (err, posts) {
    res.render("Post/index", {posts: posts});
  });
});

// NEW
// New Post Form - starts from link on author's page
app.get('/Posts/:id/New', function (req, res){
  db.Author.find(req.params.id).done(function(err,author){
    res.render("Post/new", {author:author,title:"", body:""});
  });
});

// actual method of post which starts from link on author's page
app.post('/Posts/:id', function (req, res) {
  var title = req.body.post.title;
  var body = req.body.post.body;
  db.Post.create({
    title: title,
    body: body,
    AuthorId: req.params.id
  })
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


// SHOW the full post
app.get('/Posts/:id', function (req, res){
  // console.log("ARTICLE IS HERE..");

  db.Post.findAll({
    where: {
      AuthorId: req.params.id
    }
  }).done(function(err, posts) {
    console.log("HERE ARE OUR POSTS",posts)
    res.render('Post/show', {posts: posts});
  });
});


// EDIT POST
app.get('/Posts/:id/edit', function (req, res) {
  //find our Post
  var id = req.params.id;
  db.Post.find(id).success(function(post){
      res.render('Post/edit', {post: post});
  });
});

// UPDATE author info
app.put('/Posts/:id', function (req, res) {
  var id = req.params.id;
  db.Post.find(id).success(function(post){
      post.updateAttributes
      ({title: req.body.post.title, body: req.body.post.body
      }).done(function(err, success){
      if (err){
        var errMsg = "Title must be at least 6 characters";
        res.render('/Posts/:id/edit', {errMsg:errMsg, post: post});
        // why did you need to go through this
      }
      else {
    res.redirect('/Posts');
      }
    });
  });
});

// DELETE
app.delete('/Posts/:id', function (req, res) {
  var id = req.params.id;
  db.Post.find(id).success(function(post){
      post.destroy().success(function(){
      res.redirect('/Posts');
    });
  });
});

app.get('*', function(req,res){
  res.status(404);
  res.render('404');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});