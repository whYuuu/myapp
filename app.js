//import modules
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var app = express();
var session = require('express-session');
var flash = require('connect-flash');
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

//view setting
app.set("view engine","ejs");

//set middlewears
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({secret:'MySecret'}));

var passport = require('./config/passport.js');
app.use(passport.initialize());
app.use(passport.session());

//set route
app.use('/',require('./routes/home.js'));
app.use('/posts',require('./routes/posts'));
app.use('/users',require('./routes/users'));

// set server
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server On!');
});
