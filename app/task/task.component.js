'use strict';

angular.
  module('task').
  component('task', {
    templateUrl: 'task/task.template.html',
    controller: function TaskController($http,$timeout) {
      var self = this;
      self.isTimerRunning = [];
      self.delay = 1000;

      // TODO: Load tasks from mongodb
      $http.get('task/task.static.json').then(function(response) {
        self.tasks = response.data;
      });

      self.addTask = function(){
        var newTask = {
            "name": "",
            "estimated": NaN,
            "actual": 0.0
        };
        self.tasks.push(newTask);
        // TODO: Add task to database
      }
      self.removeTask = function(index){
        self.isTimerRunning.splice(index,1);
        self.tasks.splice(index,1);
        // TODO: Remove task from database
      }

      self.toggleTimer = function(index){
        if(self.isTimerRunning[index] == undefined || !self.isTimerRunning[index]){
          self.isTimerRunning[index] = true;
        } else {
          self.isTimerRunning[index] = false;
        }
        //console.log(self.isTimerRunning);
      }

      self.tickTock = function(){
        for(var i = 0; i < self.isTimerRunning.length; i++){
          if(self.isTimerRunning[i]){
            self.tasks[i].actual += 1.0;
          }
        }
        $timeout(self.tickTock, self.delay);
        //console.log("Tick");
      }
      $timeout(self.tickTock, self.delay);

      self.getStopwatchStatus = function(index){     
        //console.log(self.isTimerRunning);   
        return (self.isTimerRunning[index] == undefined || !self.isTimerRunning[index])?"Start":"Stop";
      }

      self.getVelocity = function(index){
        return self.tasks[index].estimated/self.tasks[index].actual;
      }
    }
  });
