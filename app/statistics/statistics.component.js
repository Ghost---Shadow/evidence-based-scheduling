'use strict';

angular.
  module('statistics', ['chart.js']).
  component('statistics', {
    templateUrl: 'statistics/statistics.template.html',
    controller: function StatisticsController($http) {
      var self = this;
      $http.get('statistics/statistics.static.json').then(function (response) {
        self.statistics = response.data;
        self.labels = self.statistics.labels;
        self.data = self.statistics.data;
      });

      self.analysis = ["Estimated time placeholder","Actual time placeholder"];
    }
  });
