'use strict';

/**
 * @ngdoc service
 * @name travelmapUiApp.RestService
 * @description
 * # RestService
 * Service in the travelmapUiApp.
 */
angular.module('travelmapUiApp')
  .service('RestService', function ($q, $http) {
    this.get = function (url) {
      return $q(function (resolve, reject) {
        $http.get(appConfig.MAP_API_SOURCE + url).then(function (data) {
          resolve(data.data);
        }, function (err) {
          reject(err);
        });
      });
    };

  });
