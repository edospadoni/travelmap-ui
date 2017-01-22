'use strict';

/**
 * @ngdoc directive
 * @name travelmapUiApp.directive:Popup
 * @description
 * # Popup
 */
angular.module('travelmapUiApp')
  .directive('popup', function () {
    return {
      templateUrl: 'scripts/directives/popup.html',
      restrict: 'E',
      controller: function ($scope, MapService, CityService) {
        $scope.invalidSecret = false;
        if ($scope.inSearchMode) {
          $scope.currentCity = {
            name: $scope.searchedCity.text,
            country_code: $scope.searchedCity.context[$scope.searchedCity.context.length - 1].short_code.toLowerCase(),
            formatted_address: $scope.searchedCity.place_name,
            lat: $scope.searchedCity.geometry.coordinates[1],
            lng: $scope.searchedCity.geometry.coordinates[0],
          };
        } else {
          $scope.selectedCity.country_code = $scope.selectedCity.country_code.toLowerCase();
          $scope.currentCity = $scope.selectedCity;
        }

        $scope.updateCountries = function () {
          $scope.getCountries(function (geoJSONCountriesCollection) {
            // remove source and layer from map
            MapService.removeSource($scope.map, 'countries');
            MapService.removeLayer($scope.map, 'countries');

            // add countries source to map
            MapService.addSource($scope.map, "countries", geoJSONCountriesCollection);

            // add countries layer to map
            MapService.addLayer($scope.map, "countries", "fill", {}, {
              "fill-color": "#fff",
              "fill-opacity": 0.2
            });
          });
        };

        $scope.addCity = function (city) {
          CityService.addCity(city).then(function (newCity) {
            $scope.invalidSecret = false;
            city.id = newCity.id;
            $scope.inSearchMode = false;
            $scope.currentCity = city;

            if ($scope.map.getSource('searchedCity')) {
              MapService.removeSource($scope.map, 'searchedCity');
              MapService.removeLayer($scope.map, 'searchedCity');
            }

            if ($scope.map.getSource('cities')) {
              MapService.updateSource($scope.map, 'cities', {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [city.lng, city.lat]
                },
                "properties": city
              });
            } else {
              MapService.addSource($scope.map, 'cities', [{
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [city.lng, city.lat]
                },
                "properties": city
              }]);
              MapService.addLayer($scope.map, "cities", "symbol", {
                "icon-image": "circle-15",
                "icon-allow-overlap": true
              }, {});
            }
            // update countries
            $scope.updateCountries();
          }, function (reason) {
            if (reason.status == 403) {
              $scope.invalidSecret = true;
              $('#settings')
                .popup('show');
            }
            console.error(reason);
          });
        };

        $scope.removeCity = function (city) {
          CityService.removeCity(city.id).then(function (res) {
            $scope.invalidSecret = false;
            MapService.removeSourceElement($scope.map, 'cities', city.id);

            $scope.popup.remove();
            if ($scope.map.getSource('searchedCity')) {
              MapService.removeSource($scope.map, 'searchedCity');
              MapService.removeLayer($scope.map, 'searchedCity');
            }

            // update countries
            $scope.updateCountries();
          }, function (reason) {
            if (reason.status == 403) {
              $scope.invalidSecret = true;
              $('#settings')
                .popup('show');
            }
            console.error(reason);
          });
        };
      }
    };
  });
