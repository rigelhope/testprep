'use strict';

/**
 * @ngdoc function
 * @name testprepApp.controller:SessionsCtrl
 * @description
 * # SessionsCtrl
 * Controller of the testprepApp
 */
angular.module('testprepApp')
  .controller('SessionsCtrl', function ($scope, $timeout, $location, DataService) {

    $scope.sessions = DataService.getKeys;

  });

