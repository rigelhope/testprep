'use strict';

/**
 * @ngdoc filter
 * @name testprepApp.filter:subject
 * @function
 * @description
 * # subject
 * Filter in the testprepApp.
 */
angular.module('testprepApp')
  .filter('subject', function () {
    return function(questions, subjects) {
      var selectedGroups = questions.filter(function(question) {
        return subjects[question.subject].selected;
      });

      return selectedGroups.reduce(function(all, group) {
        return all.concat(group);
      }, []);
    };
  });
