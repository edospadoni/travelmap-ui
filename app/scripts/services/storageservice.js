'use strict';

/**
 * @ngdoc service
 * @name travelmapUiApp.StorageService
 * @description
 * # StorageService
 * Service in the travelmapUiApp.
 */
angular.module('travelmapUiApp')
  .service('StorageService', function () {
    this.get = function (id) {
      return JSON.parse(localStorage.getItem(id));
    };

    this.set = function (id, value) {
      localStorage.setItem(id, JSON.stringify(value));
    };

    this.delete = function (id) {
      localStorage.removeItem(id);
    };
  });
