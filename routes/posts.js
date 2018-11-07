var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Post = require('../models/Post.js');

//index
router.get('/',function(req,res){
  Post.find({}).populate("author").sort('-createdAt').exec(function(err,posts){
    if(err) return res.json({success:false, message:err});
    res.render('posts/index',{posts:posts, user:req.user});
  });
});
//new
router.get('/new',isLoggedIn,function(req,res){
  res.render('posts/new',{user:req.user});
});
//create
router.post('/',isLoggedIn,function(req,res){
  req.body.post.author=req.user._id;
  Post.create(req.body.post,function(err,post){
    if(err) return res.json({success:false, message:err});
    res.redirect('/posts');
  });
});
//show
router.get('/:id',function(req,res){
  Post.findById(req.params.id).populate('author').exec(function(err,post){
    if(err) return res.json({success:false, message:err});
    res.render('posts/show',{post:post,user:req.user});
  });
});
//Edit
router.get('/:id/edit',isLoggedIn,function(req,res){
  Post.findById(req.params.id,function(err,post){
      if(err) return res.json({success:false, message:err});
      res.render('posts/edit',{post:post,user:req.user});
  });
});
//update
router.put('/:id',isLoggedIn,function(req,res){
  req.body.post.updatedAt = Date.now();
  Post.findOneAndUpdate({_id:req.params.id,author:req.user._id},req.body.post,function(err,post){
    if(err) return res.json({success:'false',message:err});
    if(!post) return res.json({success:'false',message:"No data found and update"});
    res.redirect("/posts/"+req.params.id);
  });
});
//destroy
router.delete('/:id',isLoggedIn,function(req,res){
  Post.findOneAndRemove({_id:req.params.id,author:req.user._id},function(err,post){
    if(err) return res.json({success:'false',message:err});
    if(!post) return res.json({success:'false',message:"No data found and remove"});
    res.redirect("/posts");
  });
});


function isLoggedIn(req,res,next){
  if(req.isAuthenticated){
    return next();
  }
  res.redirect('/');
}

module.exports = router;
