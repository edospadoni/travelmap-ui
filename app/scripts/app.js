'use strict';

/**
 * @ngdoc overview
 * @name travelmapUiApp
 * @description
 * # travelmapUiApp
 *
 * Main module of the application.
 */
angular
  .module('travelmapUiApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
