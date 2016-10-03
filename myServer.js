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
  console.log(req.body);
  res.sendFile(__dirname + '/index.html');
});

//get all API for the survey
app.get('/survey', function(req, res){
  db.mysurvey.find({}, function(err, info){
   (err ? res.json(err) : res.json(info))
  });
});

//get one result from the survey
app.get('/survey/:id', function(req, res){
  res.end(req.params.id);
  db.mysurvey.findOne({_id: req.params.id}).toArray(function(err, info){
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
  res.end(req.params.id);
  db.mysurvey.remove({_id: req.params.id}, function (err, product) {
       if (!err) {
         console.log("removed");
         res.send('');
       }
       else {
         console.log(err);
       }
     });
   });

// lets try an update request here
app.put('/survey', function(req, res){
  res.send('Put request at /survey');
  // var item = {
  //   Name: req.body.Name,
  //   ComputerOS: req.body.ComputerOS,
  //   PhoneOS: req.body.PhoneOS
  // };
  // var updateDB = req.params.id;
  // db.mysurvey.findById(updateDB, {
  //   $set: item
  // },
  // {
  //   sort:{_id: -1},
  //   upsert: true
  // }, function(err, info){
  //   (err ? res.json(err) : res.json(info))
  // });
});

//fire up the server
app.listen(Port, function(){
  console.log('Jet Set Radio broadcasting on channel ' + Port)
});
