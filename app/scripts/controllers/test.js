'use strict';
/*global localforage */

/**
 * @ngdoc function
 * @name testprepApp.controller:TestCtrl
 * @description
 * # TestCtrl
 * Controller of the testprepApp
 */
angular.module('testprepApp')
  .controller('TestCtrl', function ($scope, $location, DataService) {

    $scope.questions = DataService.questions;

    //select first question in list to open with
    $scope.selectedQuestion = $scope.questions[0];

    //init with answer not showing
    $scope.model = {'mustShow': false};

    //nextQuestion and previous Question return indexes
    $scope.nextQuestion = function(){
      return $scope.questions[($scope.questions.indexOf($scope.selectedQuestion))+1];
    };
    $scope.previousQuestion = function(){
      return $scope.questions[($scope.questions.indexOf($scope.selectedQuestion))-1];
    };
    
    //go-to question
    $scope.setQuestion = function(q) {
      var qIdx = $scope.questions.indexOf(q);
      $scope.selectedQuestion = $scope.questions[qIdx];
      //reset "show answer" checkbox
      $scope.model.mustShow = false;
    };

    $scope.setTag = function(q, newTag) {
      console.log('adding tag '+newTag+' to question '+q.id);
      q.tags.push(newTag);
    };

    $scope.checkTag = function(q, tag) {
      return (q.tags.indexOf(tag) > -1);
    };

    $scope.saveSession = function() {
      var sessionName = new Date().toString();
      //console.log(sessionName);
      localforage.setItem(sessionName, JSON.stringify(DataService.questions))
        .then(function () {
          console.log('saved session as '+sessionName);
        });
    };
  });
