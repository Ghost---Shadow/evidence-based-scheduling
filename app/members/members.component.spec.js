'use strict';

describe('members module', function() {

  beforeEach(module('members'));

  describe('members controller', function(){

    it('should be defined ', inject(function($controller) {
      var membersControler = $controller('MembersController');
      expect(membersControler).toBeDefined();
    }));

  });
});