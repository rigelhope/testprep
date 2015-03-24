'use strict';

/**
 * @ngdoc filter
 * @name testprepApp.filter:shuffle
 * @function
 * @description
 * # shuffle
 * Filter in the testprepApp.
 * Fisher-Yates shuffle, per http://bost.ocks.org/mike/shuffle/
 */
angular.module('testprepApp')
  .filter('shuffle', function () {
    return function (questionArray) {
      var m = questionArray.length, t, i;

      while (m) {
        i = Math.floor(Math.random() * m--);
        t = questionArray[m];
        questionArray[m] = questionArray[i];
        questionArray[i] = t;
      }
      return questionArray;
    };

/*
    return function (input) {
      return 'shuffle filter: ' + input;
    };
*/
  });
