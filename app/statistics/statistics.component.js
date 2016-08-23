'use strict';

angular.
  module('statistics').
  component('statistics', {
    templateUrl: 'statistics/statistics.template.html',
    controller: function StatisticsController($http) {
      var self = this;
      $http.get('statistics/statistics.static.json').then(function(response) {
        self.statistics = response.data;
      });

    }
  });
