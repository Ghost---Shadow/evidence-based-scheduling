'use strict';

angular.
  module('members').
  component('members', {
    templateUrl: 'members/members.template.html',
    controller: function MembersController($http) {
      var self = this;
      $http.get('members/members.static.json').then(function(response) {
        self.people = response.data;
      });

    }
  });
