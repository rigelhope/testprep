'use strict';

/**
 * @ngdoc service
 * @name testprepApp.DataService
 * @description
 * # DataService
 * Service in the testprepApp.
 */
angular.module('testprepApp')
  .service('DataService', function($http) {
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
      this.tags = [];
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
          });

          return service.qbank;
        });
      }


    };
    return service;
  });
