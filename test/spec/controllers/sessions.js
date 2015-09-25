'use strict';
 
describe('Controller: SessionsCtrl', function () {

  // load the controller's module
  beforeEach(module('testprepApp'));

  var SessionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SessionsCtrl = $controller('SessionsCtrl', {
      $scope: scope
    });
  }));

  xit('should get a list of sessions', function() {
  
  });


});
