'use strict';

/**
 * @ngdoc service
 * @name travelmapUiApp.CityService
 * @description
 * # CityService
 * Service in the travelmapUiApp.
 */
angular.module('travelmapUiApp')
  .service('CityService', function ($q, RestService) {
    this.getAllCities = function () {
      return $q(function (resolve, reject) {
        RestService.get('/city').then(function (cities) {
          resolve(cities);
        }, function (reason) {
          reject(reason);
        });
      });
    };

    this.addCity = function (city) {
      return $q(function (resolve, reject) {
        RestService.post('/city', city).then(function (city) {
          resolve(city);
        }, function (reason) {
          reject(reason);
        });
      });
    };

    this.removeCity = function (cityId) {
      return $q(function (resolve, reject) {
        RestService.delete('/city/' + cityId).then(function (city) {
          resolve(city);
        }, function (reason) {
          reject(reason);
        });
      });
    };
  });
