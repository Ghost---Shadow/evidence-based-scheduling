'use strict';

describe('statistics module', function() {

  beforeEach(module('statistics'));

  describe('statistics controller', function(){

    it('should be defined ', inject(function($controller) {
      var statisticsController = $controller('StatisticsController');
      expect(statisticsController).toBeDefined();
    }));

  });
});