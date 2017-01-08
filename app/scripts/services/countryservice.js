'use strict';

/**
 * @ngdoc service
 * @name travelmapUiApp.CountryService
 * @description
 * # CountryService
 * Service in the travelmapUiApp.
 */
angular.module('travelmapUiApp')
  .service('CountryService', function ($q, RestService) {
    this.getAllCountries = function () {
      return $q(function (resolve, reject) {
        RestService.get('/country').then(function (cities) {
          resolve(cities);
        }, function (reason) {
          reject(reason);
        });
      });
    };

    this.getGeoJSONCountryCoordinates = function (code) {
      return $q(function (resolve, reject) {
        RestService.get('/country/' + code + '/geojson').then(function (coordinates) {
          resolve(coordinates);
        }, function (reason) {
          reject(reason);
        });
      });
    };
  });
