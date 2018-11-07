var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var passport = require('../config/passport.js');

router.get('/',function(req,res){
  res.redirect('/posts');
});
router.get('/login',function(req,res){
  res.render('login/login',{email:req.flash("email")[0],loginError:req.flash('loginError')});
});
router.post('/login',
  function(req,res,next){
    req.flash("email");
    if(req.body.email.length === 0 || req.body.password.length === 0 ){
      req.flash("email",req.body.email);
      req.flash("loginError","please Enter both email and password");
      req.redirect('/login');
    }
    else{
      next();
    }
  }, passport.authenticate('local-login',{
    successRedirect:'/posts',
    failureRedirect:'/login',
    failureFlash:true
  })
);
router.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
