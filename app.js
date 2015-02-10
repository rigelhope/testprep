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
      $routeProvider.when("/session", {
          templateUrl: "session.html",
          controller: "sessionController"
      });
      $routeProvider.otherwise({
        redirectTo: "/session"
      });
    });

  app.controller('sessionController', function($scope, $location, DataService) {
    /*
     *
     */
     //first check localForage to see if there's an existing session already
     localforage.keys()
      .then(function(keys) {
        console.log('found keys : ' + keys);
        if (keys.length) {
          console.log('found a session!');
          // load session, pass directly to test
        } else {
          console.log('found no stored sessions, generating new one');
          DataService.fetchData();
          $location.path('/choose_subjects');
        }
     })

     //if no sessions exist, then pull from service.fetchData
     //TODO: import arbitrary qbank

  });

  app.controller('subjectChoiceController', function($scope, $location, DataService) {

    /* simple controller that loads the question bank and
     * gets a list of subjects
     */

    $scope.allSubjects = DataService.subjects;
    //console.log('subject choice controller found the following objects: ' + $scope.allSubjects);

    $scope.clearSelections = function() {
        angular.forEach($scope.allSubjects, function(subject) {
            subject.selected = false;
        });
    };

    $scope.goToQuestions = function() {
      $location.path('/test')
    }
  });

  app.controller('testprepController', function($scope, $location, DataService, $filter) {

    //first filter by subject
    //$scope.questions = $filter('subjectFilter')(DataService.qbank, DataService.subjects);
    //then shuffle list
    //$scope.questions = $filter('shuffleFilter')($scope.questions);

    DataService.filterSubjects();
    DataService.shuffleTest();

    $scope.questions = DataService.activeTest;

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

    $scope.toggleTag = function(q, tag) {
      //console.log('adding tag '+newTag+' to question '+q.id);
      if (checkTag(q, tag)) {
        q.tags.pop(tag);
        console.log('tag removed: ' + tag);
      } else {
        q.tags.push(tag);
        console.log('tag added: ' + tag);
      };
    };

    $scope.setTag = function(q, tag) {
      q.tags.push(tag);
      console.log('set tag: ' + tag);
    };

    checkTag = function(q, tag) {
      return (q.tags.indexOf(tag) > -1);
    };

    $scope.checkTag = checkTag;

    //$scope.storeData = DataService.storeData();

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

  app.service("DataService", function($http, $filter) {

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
      activeTest: [],

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
      },

      filterSubjects: function() {
        this.activeTest = $filter('subjectFilter')(this.qbank, this.subjects);
      },

      shuffleTest: function() {
        this.activeTest = $filter('shuffleFilter')(this.activeTest);
      },

    };
    return service;
  })
})();
