'use strict';

/**
 * @ngdoc function
 * @name testprepApp.controller:SubjectsCtrl
 * @description
 * # SubjectsCtrl
 * Controller of the testprepApp
 * loads the question bank and get/displays a list of subjects to filter by
 */
angular.module('testprepApp')
  .controller('SubjectsCtrl', function ($scope, $location, DataService) {

    DataService.fetchData('generated.json').then(function() {
      $scope.allSubjects = DataService.subjects;
      //console.log(JSON.stringify($scope.allSubjects));
      console.log($scope.allSubjects);
    });

    $scope.clearSelections = function() {
        angular.forEach($scope.allSubjects, function(subject) {
            subject.selected = false;
        });
    };

    $scope.goToQuestions = function() {
      DataService.filterSubjects(DataService.subjects);
      DataService.shuffleQuestions();
      $location.path('/test');
    };
  });

