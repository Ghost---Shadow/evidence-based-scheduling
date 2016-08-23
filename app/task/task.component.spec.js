'use strict';

describe('task module', function() {

  beforeEach(module('task'));

  describe('task controller', function(){

    it('should be defined ', inject(function($controller) {
      var taskController = $controller('TaskController');
      expect(taskController).toBeDefined();
    }));

  });
});