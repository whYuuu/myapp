//import modules
var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


//connect database
mongoose.connect(process.env.MONGO_DB); //환경변수에 저장.. 중요한정보를 소스채로 업로드 하면 해킹당한다.
var db = mongoose.connection;
db.once("open",function(){
  console.log("DB Connected");
});
db.on("error",function(err){
  console.log("DB Error : ",err);
});

//model setting
var postSchema = mongoose.Schema({
  title:{type:String, required:true},
  body:{type:String, required:true},
  createdAt:{type:Date, default:Date.now},
  updatedAt:Date
});
var Post = mongoose.model('post',postSchema);

//view setting
app.set("view engine","ejs");

//set middlewears
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//set route
//index
app.get('/posts',function(req,res){
  Post.find({}).sort('-createdAt').exec(function(err,posts){
    if(err) return res.json({success:false, message:err});
    res.render('posts/index',{data:posts});
  });
});
//new
app.get('/posts/new',function(req,res){
  res.render('posts/new');
});
//create
app.post('/posts',function(req,res){
  Post.create(req.body.post,function(err,post){
    if(err) return res.json({success:false, message:err});
    res.redirect('/posts');
  });
});
//show
app.get('/posts/:id',function(req,res){
  Post.findById(req.params.id,function(err,post){
    if(err) return res.json({success:false, message:err});
    res.render('posts/show',{data:post});
  });
});
//Edit
app.get('/posts/:id/edit',function(req,res){
  Post.findById(req.params.id,function(err,post){
      if(err) return res.json({success:false, message:err});
      res.render('posts/edit',{data:post});
  });
});
//update
app.put('/posts/:id',function(req,res){
  req.body.post.updatedAt = Date.now();
  Post.findByIdAndUpdate(req.params.id,req.body.post,function(err, post){
    if(err) return res.json({success:false, message:err});
    res.redirect('/posts/'+req.params.id);
  });
});
//destroy
app.delete('/posts/:id',function(req,res){
  Post.findByIdAndRemove(req.params.id,function(err,post){
    if(err) return res.json({success:false, message:err});
    res.redirect("/posts");
  });
});

// set server
app.listen(3001, function(){
  console.log('Server On!');
});
