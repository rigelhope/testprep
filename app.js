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
      $routeProvider.when("/import", {
          templateUrl: "import.html",
          controller: "importController"
      });
      $routeProvider.otherwise({
        redirectTo: "/choose_subjects"
      });
    });

  app.controller('importController', function($scope, $location, DataService) {
  });

  app.controller('subjectChoiceController', function($scope, $location, DataService) {

    /* simple controller that loads the question bank and
     * gets a list of subjects
     */
    DataService.fetchData().then(function() {
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
      $location.path('/test')
    }
  });


  app.filter('subjectFilter', function() {

    /* filters active questions based on subjects selected
     *
     */

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

    /* Fisher-Yates shuffle implemented as a filter
     * per http://bost.ocks.org/mike/shuffle/
     */

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

    //first filter by subject
    $scope.questions = $filter('subjectFilter')(DataService.qbank, DataService.subjects);
    //then shuffle list
    $scope.questions = $filter('shuffleFilter')($scope.questions);

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
      var qIdx = $scope.questions.indexOf(q)
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

    $scope.storeData = DataService.storeData();

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
      this.tags = [];
    }

    var service = {
      //qbank will contain the cached global set of questions
      qbank: [],
      subjects: {},

      //fetchData is the init function, should only need to be run once per session.
      fetchData: function() {
        if (
          localforage.length>0 &&
          window.confirm('would you like to load a saved session?')
        ) {
          //not sure how to use the localForage key/keys function
          service.qbank = localforage.getItem('stored_session', function(value) {
            return value;
          })
        } else {
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
      },

      storeData: function() {
        //
        localforage.setItem('stored_session',service.qbank, function() {
          console.log('stored session!');
        });
      }

    };
    return service;
  })
})();
