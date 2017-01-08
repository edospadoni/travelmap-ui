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

    this.getCityPointProperties = function (city) {
      return {
        "icon": "circle",
        "description": [
          "<strong>" + city.name + "</strong>",
          "<p>" + city.formatted_address + "</p>",
          "<span class=\"flag-icon flag-icon-" + city.country_code.toLowerCase() + "\"></span>"
        ].join("")
      };
    }
  });
