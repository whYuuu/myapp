var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB); //환경변수에 저장.. 중요한정보를 소스채로 업로드 하면 해킹당한다.

var db = mongoose.connection;

db.once("open",function(){
  console.log("DB Connected");
});

db.on("error",function(err){
  console.log("DB Error : ",err);
});

var dataSchema = mongoose.Schema({
  name:String,
  count:Number
});
var Data = mongoose.model('data',dataSchema);
Data.findOne({name:"myData"},function(err,data){
  if(err) return console.log("Data Error : ",err);
  if(!data){
    Data.create({name:"myData",count:0},function(err,data){
      if(err) return console.log("Data Error : ",err);
      console.log("Count Initializeed : ",data);
    });
  }
});


app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
  Data.findOne({name:"myData"},function(err,data){
    if(err) return console.log("Data Error : ",err);
    data.count++;
    data.save(function(err){
      if(err) return console.log("Data Error : ",err);
      res.render('my_first_ejs',data);
    });
  });
});

app.get('/reset',function(req,res){
  setCounter(res,0);
});

app.get('/set/count',function(req,res){
  if(req.query.count) setCounter(res,req.query.count);
  else getCounter(res);
});

app.get('/set/:num',function(req,res){
  if(req.params.num) setCounter(res,req.params.num);
  else getCounter(res);
});

function setCounter(res,num){
  Data.findOne({name:"myData"},function(err,data){
    if(err) return console.log("Data Error : ",err);
    data.count = num;
    data.save(function(err){
      if(err) return console.log("Data Error : ",err);
      res.render('my_first_ejs',data);
    });
  });
}

function  getCounter(res){
  Data.findOne({name:"myData"},function(err,data){
    if(err) return console.log("Data Error : ",err);
    res.render('my_first_ejs',data);
  });
}

app.listen(3000, function(){
  console.log('Server On!');
});
