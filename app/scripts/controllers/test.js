'use strict';

/**
 * @ngdoc function
 * @name testprepApp.controller:TestCtrl
 * @description
 * # TestCtrl
 * Controller of the testprepApp
 */
angular.module('testprepApp')
  .controller('TestCtrl', function ($scope, $location, DataService, $filter) {

    // move this stuff to DataService
    //first filter by subject  
    $scope.questions = $filter('subject')(DataService.qbank, DataService.subjects);
    //then shuffle list
    $scope.questions = $filter('shuffle')($scope.questions);

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
      localforage.setItem(sessionName, $scope.questions)
        .then(function () {
          console.log('saved session as '+sessionName);
        });
    };
  });
