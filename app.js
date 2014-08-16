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
    $scope.activeSubjects = [];
    $scope.submit = function() {
      var activeSubjects = [];
      for (var subject in $scope.subjects) {
        console.log("selected subject: " + subject);
        if ($scope.subjects[subject]) {
          activeSubjects.push(subject);
        };
      };
      $scope.qbank = DataService.setSubjectLimits(activeSubjects);
      $scope.activeSubjects = activeSubjects;
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
      qbank: [],
      selectedItem: {},
      setSelected: function(selectedItem) {
        angular.copy(selectedItem, service.selectedItem);
        console.log(service.selectedItem)
      },

      getData: function() {
        return $http.get('generated.json').then(function(result) {
          angular.copy(result.data, service.qbank);
          service.activeSubset = service.setSubjectLimits();
          service.setSelected(service.activeSubset[0])
          return service.selectedItem;

        })
      },

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

      allSubjects: function () {
          return Object.keys(service.getSubjectDirectory());
      },

      activeSubset: [],
      setSubjectLimits: function setSubjectLimits(subjects) {
        limited = [];
        //push qbank, limited by an array of subject strings, into activeSubset
        if (typeof subjects == "string") {
          subjects = [subjects];
        };
        if (subjects instanceof Array) {
          for (var i = 0; i < service.qbank.length; i++) {
            var question = service.qbank[i];
            if (subjects.indexOf(question.subject.$t) > -1) {
              limited.push(question);
            };
          };
          console.log('subjects limited to: ' + limited);
        } else {
          console.log('no subject limits found');
          limited = service.qbank;
        };
        return limited;
      }

    };
    //  service.getData();
    return service;
  })
})();
