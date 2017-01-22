'use strict';

/**
 * @ngdoc service
 * @name travelmapUiApp.RestService
 * @description
 * # RestService
 * Service in the travelmapUiApp.
 */
angular.module('travelmapUiApp')
  .service('RestService', function ($q, $http, StorageService) {
    this.get = function (url) {
      return $q(function (resolve, reject) {
        $http.get(appConfig.MAP_API_SOURCE + url).then(function (data) {
          resolve(data.data);
        }, function (err) {
          reject(err);
        });
      });
    };

    this.post = function (url, obj) {
      obj.secret = StorageService.get('secret');
      return $q(function (resolve, reject) {
        $http.post(appConfig.MAP_API_SOURCE + url, obj).then(function (data) {
          resolve(data.data);
        }, function (err) {
          reject(err);
        });
      });
    };

    this.delete = function (url) {
      var secret = StorageService.get('secret');
      return $q(function (resolve, reject) {
        $http({
          url: appConfig.MAP_API_SOURCE + url,
          method: 'DELETE',
          data: {
            secret: secret
          },
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          }
        }).then(function (data) {
          resolve(data.data);
        }, function (err) {
          reject(err);
        });
      });
    };

  });
