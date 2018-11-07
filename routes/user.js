var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../models/User.js');
var async = require('async');

router.get('/new',function(req,res){
  res.render('users/new', {
                            formData:req.flash('formData')[0],
                            emailError:req.flash('emailError')[0],
                            nicknameError:req.flash('nicknameError')[0],
                            passwordError:req.flash('passwordError')[0]
                          }
  );
});
router.post('/',checkUserRegValidation,function(req,res,next){
  User.create(req.body.user,function(err,user){
    if(err) return res.json({success:false,message:err});
    res.redirect('/login');
  });
});

//show
router.get('/:id',isLoggedIn,function(req,res){
  if(req.user._id != req.params.id) return res.json({success:false, message:"UnAuthrized attempt!"});
  User.findById(req.params.id,function(err,user){
    if(err) return res.json({success:false,message:err});
    res.render('users/show',{user:user});
  });
});

//edit
router.get('/:id/edit',isLoggedIn,function(req,res){
  if(req.user._id != req.params.id) return res.json({success:false, message:"UnAuthrized attempt!"});
  User.findById(req.params.id,function(err,user){
    if(err) return res.json({success:false,message:Err});
    res.render('users/edit',{
                              user:user,
                              formData:req.flash('formData')[0],
                              emailError:req.flash('emailError')[0],
                              nicknameError:req.flash('nicknameError')[0],
                              passwordError:req.flash('passwordError')[0]
                            }
    );
  });
});
//update
router.put('/:id',isLoggedIn,checkUserRegValidation,function(req,res){
  User.findById(req.params.id,req.body.user,function(err,user){
    if(err) return res.json({success:false,message:err});
    if(user.authenticate(req.body.user.password)){
      if(req.body.user.newPassword){
        req.body.user.password = user.hash(req.body.user.newPassword);
        user.save();
      } else{
        delete req.body.user.password;
      }
      User.findByIdAndUpdate(req.params.id,req.body.user,function(err,user){
        if(err) res.json({success:false,message:err});
        res.redirect('/users/'+req.params.id);
      });
    } else {
      req.flash('formData',req.body.user);
      req.flash('passwordError','- Invalid password');
      res.redirect('/users/'+req.params.id+"/edit");
    }
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated){
    return next();
  }
  res.redirect('/');
}

function checkUserRegValidation(req,res,next){
  var isValid = true;

  async.waterfall(
    [function(callback){
      User.findOne({email:req.body.user.email,_id:{$ne: mongoose.Types.ObjectId(req.params.id)}},
        function(err,user){
          if(user){
            isValid = false;
            req.flash("emailError"," this email is already registered");
          }
          callback(null,isValid);
        }
    );
  },function(isValid,callback){
      User.findOne({nickname:req.body.user.nickname,_id:{$ne: mongoose.Types.ObjectId(req.params.id)}},
        function(err,user){
          if(user){
            isValid = false;
            req.flash("nicknameError"," this nickname is already registered");
          }
          callback(null,isValid);
      }
    );
  }],function(err,isValid){
    if(err) res.json({success:false, message:err});
    if(isValid){
      return next();
    }
    else{
      req.flash("formData",req.body.user);
      res.redirect("back");
    }
  }
  );
}

module.exports = router;
