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

    $scope.sessions = [];

    DataService.getKeys().then(function() {
      $scope.sessions = DataService.sessions;
    });
    //console.log($scope.sessions);

    $timeout(function(){
      DataService.loadSession('your mom').then(function(){
        $location.path('/test')
      })
    }, 2000);
    
  });
