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
    $scope.selectedSession = '';

    DataService.getKeys().then(function() {
      $scope.sessions = DataService.sessions;
    });
    //console.log($scope.sessions);

//    $timeout(function(){
//      DataService.loadSession($scope.sessions[4]).then(function(){
      //lets just automatically load the first result for now
//        $location.path('/test')
//      })
//    }, 20000);

    $scope.startSession = function(session){
      console.log("session : "+session);
      DataService.loadSession(session).then(function(){
        $location.path('/test');
      });
    };

    $scope.getFromFile = function() {
      $location.path('/subjects');
    };

  });
