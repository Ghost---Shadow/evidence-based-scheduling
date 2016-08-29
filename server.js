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
  .then(() =>  console.log('Connection succesful'))
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
