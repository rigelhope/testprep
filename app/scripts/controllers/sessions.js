'use strict';
/*global localforage */

/**
 * @ngdoc function
 * @name testprepApp.controller:SessionsCtrl
 * @description
 * # SessionsCtrl
 * Controller of the testprepApp
 */
angular.module('testprepApp')
  .controller('SessionsCtrl', function ($scope, $timeout, $location, DataService, SessionService) {

    $scope.stored = {'keys':[]};
    
    var getKeys = function() {
      localforage.keys()
        .then(function(result) {
          console.log(result);
          $scope.stored.keys = result;
        });
    };
    
    getKeys();
//    console.log($scope.stored.keys);
    
    $timeout(function() {
      console.log($scope.stored.keys);
    }, 1000);

    //move this functionality to dataservice, or else a separate service
    //var loadStored = function(sessionKey) {
    $scope.loadStored = function(sessionKey) {
      console.log('loading session: '+sessionKey);
      $timeout(function() {
        localforage.getItem(sessionKey)
          .then(function(result) {
            console.log('got session');
            DataService.loadQuestions(result);
          })
          .then(function() {
            console.log('sending to loaded test');
            $location.path('/test');
          });
      }, 2000);
    };

//    $scope.loadStored = loadStored;
  });

