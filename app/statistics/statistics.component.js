'use strict';
/*
angular.
  module('statistics', ['chart.js']).
  component('statistics', {
    templateUrl: 'statistics/statistics.template.html',
    controller: function StatisticsController($http, $scope) {
      var self = this;
      
      $http.get('statistics/statistics.static.json').then(function (response) {
        self.statistics = response.data;
        self.labels = self.statistics.labels;
        self.data = self.statistics.data;
      });
      
      console.log($scope.tasks);
      self.analysis = ["Estimated time placeholder", "Actual time placeholder"];
    }
  });
*/

angular.
  module('tasks', ['chart.js']).controller('StatisticsController', function ($scope) {
  console.log($scope.tasks);
});