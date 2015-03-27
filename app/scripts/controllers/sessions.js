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
  .controller('SessionsCtrl', function ($scope, $timeout) {

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
  });

