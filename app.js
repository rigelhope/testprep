(function() {

  var app = angular.module('testprep', ['ngSanitize', 'ngRoute'])
    .config(function($routeProvider) {
      $routeProvider.when("/choose_subjects", {
        templateUrl: "/subjects.html"
      });
      $routeProvider.when("/test", {
        templateUrl: "/test.html"
      });
      $routeProvider.otherwise({
        templateUrl: "/subjects.html"
      });
    });

  app.controller('testprepController', function($scope, $location, DataService) {
    $scope.model = {
      mustShow: false,
      answered: {}
    }
    $scope.selectedQuestion = DataService.selectedItem;
    $scope.setPointer = function(selectedQuestion) {
      DataService.setSelected(selectedQuestion);
      $scope.model.mustShow = false;
    };

    DataService.getData().then(function() {
      $scope.allSubjects = DataService.allSubjects();
      $scope.qbank = DataService.activeSubset;
    });
    /* this smells, but it works */
    $scope.subjects = {};
    $scope.submit = function() {
      $scope.qbank = DataService.setSubjectLimits($scope.subjects);
      $scope.setPointer($scope.qbank[0]);
      $location.path('/test');
    };

    $scope.nextQuestion = function(q) {
        var goToQ = $scope.qbank.indexOf(q);
        console.log("current question is index "+goToQ);
        goToQ++;
        console.log("trying to set question to index "+goToQ);
        $scope.setPointer($scope.qbank[goToQ]);
    };

    $scope.prevQuestion = function(q) {
        var goToQ = $scope.qbank.indexOf(q);
        console.log("current question is index "+goToQ);
        goToQ--;
        console.log("trying to set question to id# "+goToQ);
        $scope.setPointer($scope.qbank[goToQ]);
    };

  });

  app.service("DataService", function($http) {
    var service = {
      //qbank will contain the cached global set of questions
      qbank: [],

      //selectedItem will contain the current item
      //TODO: turn this into an index of qbank rather than containing a question copy
      selectedItem: {},

      //setSelected copies the selected item into selectedItem
      setSelected: function(selectedItem) {
        angular.copy(selectedItem, service.selectedItem);
        console.log(service.selectedItem)
      },

      //getData is the init function, should only need to be run once per session.
      //sets 'activeSubset' to entire qbank if it doesnt receive a set of limits
      getData: function() {
        return $http.get('generated.json').then(function(result) {
          angular.copy(result.data, service.qbank);
          service.activeSubset = service.setSubjectLimits();
          service.setSelected(service.activeSubset[0])
          return service.selectedItem;
        })
      },

      //getSubjectDirectory returns an object that is the directory of subjects in the qbank
      //keys are subject names
      //values are an array of qbank indexes
      getSubjectDirectory: function() {
          var subjectDir = {};
          for (var i=0;i<service.qbank.length;i++) {
              var subject = service.qbank[i].subject.$t;
              if (!subjectDir.hasOwnProperty(subject)) {
                  subjectDir[subject] = [];
              };
              subjectDir[subject].push(i);
          };
          return subjectDir;
      },

      //allSubjects returns an array of subject names
      allSubjects: function () {
          return Object.keys(service.getSubjectDirectory());
      },

      //activeSubset is the current set of testing questions
      activeSubset: [],

      //setSubjectLimits takes a list of subjects
      //    and returns a set of questions from qbank that fit those subject limits
      setSubjectLimits: function setSubjectLimits(subjects) {
        var subjectSubsetIndices = service.getSubjectSubset(subjects);
        var subjectSubsetQuestions = [];
        for (var i=0;i<subjectSubsetIndices.length;i++) {
            subjectSubsetQuestions.push(service.qbank[subjectSubsetIndices[i]]);
        };
        return subjectSubsetQuestions;
      },
      
      //setSubjectSubset returns the subject limited indices of qbank
      //refactored from setSubjectLimits
      getSubjectSubset: function (subjects) {
          //create a local variable to hold the indices
          var activeIndices = [];

          //get the subject directory
          var dir = service.getSubjectDirectory();
          
          //formatting input of "subjects" from previous version removed
          //assuming "subjects" will be of the format { subject : true/false, ... }
          for (var subject in subjects) {
              if (subjects[subject]) {
                  console.log ('adding subject '+subject+' with qbank indices '+dir[subject]);
                  activeIndices.push.apply(activeIndices, dir[subject]);
              };
          };

          return activeIndices;
      },


//  old version - activeSubset contained question objects
//        limited = [];
//        //push qbank, limited by an array of subject strings, into activeSubset
//        if (typeof subjects == "string") {
//          subjects = [subjects];
//        };
//        if (subjects instanceof Array) {
//          for (var i = 0; i < service.qbank.length; i++) {
//            var question = service.qbank[i];
//            if (subjects.indexOf(question.subject.$t) > -1) {
//              limited.push(question);
//            };
//          };
//          console.log('subjects limited to: ' + limited);
//        } else {
//          console.log('no subject limits found');
//          limited = service.qbank;
//        };
//        return limited;
//
//  rewrite - activeSubset contains qbank indices only
          
      

    };
    return service;
  })
})();
