//dependencies
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var favIcon = require('serve-favicon');
var monk = require('monk');
var Port = process.env.PORT || 8080;

//mongodb stuff
var mongojs = require('mongojs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var databaseurl = "myclass";
var collections = ["mysurvey"];
var db = mongojs(databaseurl, collections);
db.on('error', function(err){
  console.log(err);
});

//middleware stuff
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//basic get request for home page
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//get all API for the survey
app.get('/survey', function(req, res){
  db.mysurvey.find({}, function(err, info){
   (err ? res.json(err) : res.json(info))
  });
});

//sort by name
app.get('/name', function(req, res){
  db.mysurvey.find().sort({Name: 1}, function(err, info){
    (err ? res.json(err) : res.json(info))
  })
})

//sort results by computer type
app.get('/computer', function(req, res){
  db.mysurvey.find().sort({ComputerOS: 1}, function(err, info){
    (err ? res.json(err) : res.json(info))
  });
});

//sort results by phone type
app.get('/phone', function(req, res){
  db.mysurvey.find().sort({PhoneOS: 1}, function(err, info){
    (err ? res.json(err) : res.json(info))
  });
});

//post request for new entries
app.post('/survey', function(req, res){
  var myStuff = req.body;
  myStuff.read = false;
  db.mysurvey.insert(myStuff, function(err, info){
   (err ? res.json(err) : res.json(info))
  });
});

//lets try a delete request here
app.delete('/survey/:id', function(req, res) {
  var updateDB = req.params.id;
  db.mysurvey.remove({
    _id: ObjectId(updateDB)
  }, function(err, info){
    (err ? res.json(err) : res.json((info===1) ? {msg:'success'} : {msg:'error'}))
  });
});

// lets try an update request here
app.put('/survey', function(req, res){

  var item = {
    Name: req.body.Name,
    ComputerOS: req.body.ComputerOS,
    PhoneOS: req.body.PhoneOS
  };
  var myStuff = req.db;
  var collection = db.get('mysurvey');
  var updateDB = req.params.id;
  db.mysurvey.updateOne({
    _id: ObjectId(updateDB)
  }, {
    $set: item
  }, function(err, info){
    (err ? res.json(err) : res.json(info))
  });
});

//fire up the server
app.listen(Port, function(){
  console.log('Jet Set Radio broadcasting on channel ' + Port)
});
