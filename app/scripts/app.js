'use strict';

/**
 * @ngdoc overview
 * @name testprepApp
 * @description
 * # testprepApp
 *
 * Main module of the application.
 */
angular
  .module('testprepApp', [
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/subjects', {
        templateUrl: 'views/subjects.html',
        controller: 'SubjectsCtrl'
      })
      .when('/test', {
        templateUrl: 'views/test.html',
        controller: 'TestCtrl'
      })
      .when('/sessions', {
        templateUrl: 'views/sessions.html',
        controller: 'SessionsCtrl'
      })
      .otherwise({
        redirectTo: '/subjects'
      });
  });
