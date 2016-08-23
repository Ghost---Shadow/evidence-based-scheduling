'use strict';

angular.
  module('task').
  component('task', {
    templateUrl: 'task/task.template.html',
    controller: function TaskController($http) {
      var self = this;
      $http.get('task/task.static.json').then(function(response) {
        self.tasks = response.data;
      });

    }
  });
