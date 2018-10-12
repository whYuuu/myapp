//import modules
var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


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

//set route
//index
app.get('/posts',function(req,res){
  Post.find({},function(err,posts){
    if(err) return res.json({success:false, message:err});
    res.json({success:true,data:posts});
  });
});
//create
app.post('/posts',function(req,res){
  Post.create(req.body.post,function(err,post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true,data:post});
  });
});
//show
app.get('/posts/:id',function(req,res){
  Post.findById(req.params.id,function(err,post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true,data:post});
  });
});
//update
app.put('/posts/:id',function(req,res){
  req.body.post.updatedAt = Date.now();
  Post.findByIdAndUpdate(req.params.id,req.body.post,function(err, post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true,message:post._id+" updated"});
  });
});
//destroy
app.delete('/posts/:id',function(req,res){
  Post.findByIdAndRemove(req.params.id,function(err,post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true,message:post._id+" deleted"});
  });
});

// set server
app.listen(3000, function(){
  console.log('Server On!');
});
