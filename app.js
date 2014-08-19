(function() {

  var app = angular.module('testprep', ['ngSanitize', 'ngRoute'])
    .config(function($routeProvider) {

      $routeProvider.when("/choose_subjects", {
        templateUrl: "subjects.html",
        controller: "subjectChoiceController"
      });
      $routeProvider.when("/test", {
        templateUrl: "test.html",
        controller: "testprepController"
      });
      $routeProvider.otherwise({
        redirectTo: "/choose_subjects"
      });
    });

  app.controller('subjectChoiceController', function($scope, $location, DataService) {

    DataService.fetchData().then(function() {
      $scope.allSubjects = DataService.subjects;
    });

    $scope.goToQuestions = function() {
      $location.path('/test')
    }
  });


  app.filter('subjectFilter', function() {

    return function(questions, subjects) {
      var selectedGroups = questions.filter(function(question) {
        return subjects[question.subject].selected;
      });

      return selectedGroups.reduce(function(all, group) {
        return all.concat(group);
      }, [])
    }
  });

  app.filter('shuffleFilter', function () {
    //Fisher-Yates shuffle implemented as a filter, per http://bost.ocks.org/mike/shuffle/
    return function (questionArray) {
      var m = questionArray.length, t, i;

      while (m) {
        i = Math.floor(Math.random() * m--);
        t = questionArray[m];
        questionArray[m] = questionArray[i];
        questionArray[i] = t;
      };
      return questionArray;
    };
  });

  app.controller('testprepController', function($scope, $location, DataService, $filter) {

    $scope.questions = $filter('shuffleFilter')($filter('subjectFilter')(DataService.qbank, DataService.subjects));

    $scope.selectedQuestion = $scope.questions[0];
    $scope.model = {'mustShow': false};

    $scope.nextQuestion = function(){
      return $scope.questions[($scope.questions.indexOf($scope.selectedQuestion))+1];
    };
    $scope.previousQuestion = function(){
      return $scope.questions[($scope.questions.indexOf($scope.selectedQuestion))-1];
    };
    $scope.setQuestion = function(q) {
      var qIdx = $scope.questions.indexOf(q)
      $scope.selectedQuestion = $scope.questions[qIdx];
      //reset "show answer" checkbox
      $scope.model.mustShow = false;
    }


  });

  app.service("DataService", function($http) {

    function Question(rawData) {
      this.id = rawData.id;
      this.subject = rawData.subject.$t;
      this.prompt = rawData.prompt.$t;
      this.title = rawData.title.$t;
      this.answers = rawData.answerList.answer.map(function(rawAnswer) {
        var answer = {};
        answer.value = rawAnswer.$t;
        return answer;
      });
      
      this.showAnswer = false;

      //hide the answer choice;
      var correctAnswer = rawData.answerList.correct;

      this.isCorrect = function(assertedAnswer) {
        return assertedAnswer == correctAnswer;
      }

      this.explanation = rawData.explanation.$t;
    }

    var service = {
      //qbank will contain the cached global set of questions
      qbank: [],
      subjects: {},

      //fetchData is the init function, should only need to be run once per session.
      fetchData: function() {
        return $http.get('generated.json').then(function(result) {
          service.qbank = result.data.map(function(rawQuestion) {
            //clean up the question by creating an instance for each
            var question = new Question(rawQuestion);
            //sort questions into groups
            if (!service.subjects[question.subject]) {
              service.subjects[question.subject] = [];
            }
            service.subjects[question.subject].push(question);
            return question;
          })

          return service.qbank;
        })
      }


    };
    return service;
  })
})();
