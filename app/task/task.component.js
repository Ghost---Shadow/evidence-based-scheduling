'use strict';

angular.
  module('task', ['chart.js']).
  component('task', {
    templateUrl: 'task/task.template.html',
    controller: function TaskController($http, $timeout) {
      var self = this;
      self.isTimerRunning = [];
      self.analysis = {};
      self.delay = 1000;
      self.velocities = [];
      self.bins = [.2, .4, .6, .8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0];
      self.xAxis = [];
      self.yAxis = [[]];
      self.binsCount = self.bins.length;
      self.binSize = .2;

      self.refreshList = function () {
        $http.get('/tasks').then(function (response) {
          self.tasks = response.data;
          function compare(a, b) {
            var val1 = parseInt(a.order);
            var val2 = parseInt(a.order);
            if (val1 < val2)
              return -1;
            if (val1 > val2)
              return 1;
            return 0;
          }
          //self.tasks.sort(compare);
          //console.log(self.tasks);
        });
      }
      self.refreshList();

      // Add a new task
      self.addTask = function () {
        var newTask = {
          "name": "New",
          "estimated": 0.0,
          "actual": 0.0,
          "order": self.tasks.length
        };
        self.tasks.push(newTask);
        var getRequest = '/addTask/' + newTask.name + '/' + newTask.estimated + '/' + newTask.actual + '/' + newTask.order;
        $http.get(getRequest).then(function (response) {
          self.refreshList();
        });
      }

      // TODO: Optimize
      self.findIndexForId = function (_id) {
        for (var i = 0; i < self.tasks.length; i++) {
          if (self.tasks[i]._id == _id) break;
        }
        return i;
      }

      // Remove task
      self.removeTask = function (_id) {
        var index = self.findIndexForId(_id);
        self.isTimerRunning.splice(index, 1);
        self.tasks.splice(index, 1);
        var getRequest = /removeTask/ + _id;
        $http.get(getRequest).then(function (response) {
          self.refreshList();
        });
      }

      // Move task up or down
      self.changeOrder = function (_id, delta) {
        var index = self.findIndexForId(_id);
        var temp = self.tasks[index];
        self.tasks.splice(index, 1);
        self.tasks.splice(index - delta, 0, temp);
        for (var i = 0; i < self.tasks.length; i++) {
          self.tasks[i].order = i;
        }
        for (var i = 0; i < self.tasks.length; i++) {
          //self.update(self.tasks[i]._id);
        }
        //self.refreshList();
      }

      self.update = function (_id) {
        var index = self.findIndexForId(_id);
        var task = self.tasks[index];
        var getRequest = '/updateTask/' + task._id + '/' + task.name + '/' + task.estimated + '/' + task.actual + '/' + task.order;
        $http.get(getRequest).then(function (response) {
          //self.refreshList();
        });
      }

      // Toggle the state of timer
      self.toggleTimer = function (_id) {
        var index = self.findIndexForId(_id);
        if (self.isTimerRunning[index] == undefined || !self.isTimerRunning[index]) {
          self.isTimerRunning[index] = true;
        } else {
          self.isTimerRunning[index] = false;
          self.update(_id);
        }
      }

      // Increment all timers
      self.tickTock = function () {
        for (var i = 0; i < self.isTimerRunning.length; i++) {
          if (self.isTimerRunning[i]) {
            self.tasks[i].actual += 1.0;
          }
        }
        self.updateGraph();
        $timeout(self.tickTock, self.delay);
      }
      $timeout(self.tickTock, self.delay);

      // Recalculate velocities
      self.updateVelocities = function () {
        self.velocities = [];
        for (var i = 0; i < self.tasks.length; i++) {
          var task = self.tasks[i];
          if (task.actual > 0)
            self.velocities[i] = task.estimated / task.actual;
        }
      }

      // Recalculate x and y coords for graph
      self.updateGraph = function () {
        self.yAxis[0] = [];
        self.xAxis = [];
        var elapsedTime = 0;
        var estimatedTime = 0;
        // Calculate total elapsedTime
        for (var i = 0; i < self.tasks.length; i++) {
          var task = self.tasks[i];
          elapsedTime += parseFloat(task.actual);
          estimatedTime += parseFloat(task.estimated);
        }

        self.analysis.estimatedTime = "Estimated Time: " + estimatedTime / 60 + " hours";
        self.analysis.elapsedTime = "Elapsed Time: " + elapsedTime / 60 + " hours";
        self.updateVelocities();

        var frequency = [];
        var cumulativeFrequency = [];
        var n = self.velocities.length;
        for (var i = 0; i < self.binsCount; i++) {
          frequency[i] = 0;
          cumulativeFrequency[i] = 0;
        }

        for (var i = 0; i < n; i++)
          frequency[self.transfer(self.velocities[i])]++;

        //console.log(frequency);
        frequency[0] /= n;
        cumulativeFrequency[0] = frequency[0];
        //self.yAxis[0][0] = frequency[0];
        for (var i = 1; i < self.binsCount; i++) {
          frequency[i] /= n;
          cumulativeFrequency[i] = cumulativeFrequency[i - 1] + frequency[i];
          self.xAxis[i] = parseFloat((estimatedTime * self.bins[i] / 60).toFixed(3));
          self.yAxis[0][i] = cumulativeFrequency[i] * 100;
        }
        //console.log(self.xAxis);
        //console.log(self.yAxis[0]);
      }

      self.transfer = function (velocity) {
        return parseInt(velocity / self.binSize) - 1;
      }
    }
  }).filter('StartStopFilter', function () {
    return function (input) {
      return input ? "Stop" : "Start";
    }
  });

