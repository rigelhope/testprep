'use strict';

/**
 * @ngdoc function
 * @name testprepApp.controller:TestCtrl
 * @description
 * # TestCtrl
 * Controller of the testprepApp
 */
angular.module('testprepApp')
  .controller('TestCtrl', function ($scope, DataService) {

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

    // move to dataservice with a handle
    $scope.setTag = function(q, newTag) {
      //console.log('adding tag '+newTag+' to question '+q.id);
      DataService.addTag(q, newTag);
    };

    $scope.checkTag = function(q, tag) {
      return (q.tags.indexOf(tag) > -1);
    };

    //this should probably go into DataService too, actually
    $scope.saveSession = function() {
      //console.log(sessionName);
      DataService.saveSession();
    };
  });
