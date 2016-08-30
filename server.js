var express = require('express');
var app = express();

// Listen to port 80 http port
app.listen(80, function () {
  console.log('Listening for connections');
});

// Host the public folder app
app.use(express.static('app'));

// Get Handle for MongoDB through mongoose
var mongoose = require('mongoose');

// Use native Node promises
mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose.connect('mongodb://localhost/EbsMonteCarlo')
  .then(() => console.log('Connection succesful'))
  .catch((err) => console.error(err));

// Load the Task module
var Task = require('./models/Task.js');

// Return all tasks as a json file on GET request
app.get('/tasks', function (req, res, next) {
  Task.find(function (err, tasks) {
    if (err) return next(err);
    res.json(tasks);
    //console.log(tasks);
  });
});

// /addTask/NewTask/120/120/7
app.get('/addTask/:name/:estimated/:actual/:order', function (req, res, next) {
  var newTask = new Task({
    "name": req.params["name"],
    "estimated": req.params["estimated"],
    "actual": req.params["actual"],
    "order": req.params["order"]
  });
  newTask.save(function (err) {
    if (err) return console.log(err);
  })
  res.send("Done");
});

app.get('/removeTask/:_id', function (req, res, next) {
  console.log("Removing " + req.params["_id"]);
  var msg = "";
  Task.remove({ "_id": req.params["_id"] }, function (err) {
    if (err) msg = err;
    else msg = "Done";
  });
  console.log(msg);
  res.send(msg);
});

app.get('/updateTask/:_id/:name/:estimated/:actual/:order', function (req, res, next) {
  console.log("Updating " + req.params["_id"]);
  var msg = "";
  var query = { "_id": req.params["_id"] };
  var action = {
    "name": req.params["name"],
    "estimated": req.params["estimated"],
    "actual": req.params["actual"],
    "order": req.params["order"]
  };
  Task.findOneAndUpdate(query,action, function (err) {
    if (err) msg = err;
    else msg = "Done";
  });
  console.log(msg);
  res.send(msg);
});

