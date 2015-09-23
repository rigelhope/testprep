'use strict';


/**
 * @ngdoc service
 * @name testprepApp.DataService
 * @description
 * # DataService
 * Service in the testprepApp.
 */
angular.module('testprepApp')
  .service('DataService', function($http, $filter, SessionService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

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
        return assertedAnswer === correctAnswer;
      };

      this.explanation = rawData.explanation.$t;
      this.tags = []; //re-initializes every time it's instantiated, possibly a problem w persistence here
      this.annotate = function(annotation) {
        this.tags.push(annotation);
        //TODO: date/time stamp
        //TODO: annotations probably need their own data structure
        //for now it's just text and im not sure how to display it.
      };
    }

    var service = {
      //qbank will contain the cached global set of questions
      qbank: [],
      subjects: {},
      //questions will contain the (filtered) active question set
      questions: [],

      //fetchData is the init function, should only need to be run once per session.
      fetchData: function(file) {
        return $http.get(file).then(function(result) {
          service.qbank = result.data.map(function(rawQuestion) {
            //clean up the question by creating an instance for each
            var question = new Question(rawQuestion);
            //sort questions into groups
            if (!service.subjects[question.subject]) {
              service.subjects[question.subject] = [];
            }
            service.subjects[question.subject].push(question);
            return question;
          });

          return service.qbank;
        });
      },

      filterSubjects: function(subjects) {
        service.questions = $filter('subject')(service.qbank, subjects);
      },

      shuffleQuestions: function() {
        service.questions = $filter('shuffle')(service.questions);
      },

      loadQuestions: function(questionSet) {
        service.questions = questionSet;
      },

      //TODO:this really should have some kind of bounds checking
      annotateQuestion: function() {

      },

    };
    return service;
  });
