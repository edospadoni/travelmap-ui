'use strict';

/**
 * @ngdoc function
 * @name travelmapUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the travelmapUiApp
 */
angular.module('travelmapUiApp')
  .controller('MainCtrl', function ($scope, $q, MapService, CityService, CountryService, StorageService) {
    $scope.totalCountries = 195;
    $scope.visitedCountries = 0;
    $scope.isLoading = true;
    $scope.map = undefined;
    $scope.popup = undefined;
    $scope.geocoderSearch = undefined;
    $scope.secret = StorageService.get('secret') || '';
    $scope.newSecret = $scope.secret;

    $scope.inSearchMode = false;
    $scope.selectedCity = {};
    $scope.searchedCity = {};

    $scope.initGraphics = function () {
      $('#settings')
        .popup({
          inline: true,
          hoverable: true,
          on: 'click',
          position: 'bottom left',
        });
    };

    $scope.saveSecret = function () {
      if ($scope.newSecret.length > 0) {
        StorageService.set('secret', $scope.newSecret);
        $scope.secret = $scope.newSecret;
      }
    };

    $scope.removeSecret = function () {
      if ($scope.secret.length > 0) {
        $scope.secret = '';
        StorageService.delete('secret');
      }
    };

    $scope.getCountries = function (callback) {
      CountryService.getAllCountries().then(function (countries) {
        // retrieve country coordinates
        var countryPromises = {};
        $scope.visitedCountries = countries.length;
        for (var i in countries) {
          var country = countries[i];
          countryPromises[country.country_code] = CountryService.getGeoJSONCountryCoordinates(country.country_code);
        }
        // wait all promises
        $q.all(countryPromises).then(function (responses) {
          var geoJSONCountriesCollection = [];
          for (var r in responses) {
            geoJSONCountriesCollection.push({
              "type": "Feature",
              "geometry": responses[r]
            });
          }
          callback(geoJSONCountriesCollection);
        });
      }, function (reason) {
        console.error(reason);
      });
    };

    // retieve all visited countries
    $scope.init = function (mapCenter, mapZoom) {
      $scope.getCountries(function (geoJSONCountriesCollection) {
        // retrieve all visited cities
        CityService.getAllCities().then(function (cities) {
          var geoJSONCitiesCollection = [];
          for (var c in cities) {
            var city = cities[c];
            geoJSONCitiesCollection.push({
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [city.lng, city.lat]
              },
              "properties": city
            });
          }

          // init map
          $scope.map = MapService.initMap(
            mapCenter,
            mapZoom
          );

          $scope.isLoading = false;

          // wait for loading
          $scope.map.on('load', function (e) {
            // add countries source to map
            MapService.addSource($scope.map, "countries", geoJSONCountriesCollection);

            // add countries layer to map
            MapService.addLayer($scope.map, "countries", "fill", {}, {
              "fill-color": "#fff",
              "fill-opacity": 0.2
            });

            // add cities source to map
            MapService.addSource($scope.map, "cities", geoJSONCitiesCollection);

            // add cities layer to map
            MapService.addLayer($scope.map, "cities", "symbol", {
              "icon-image": "circle-15",
              "icon-allow-overlap": true
            }, {});
          });

          // init map controllers
          $scope.geocoderSearch = new MapboxGeocoder({
            accessToken: appConfig.MAP_TOKEN,
            flyTo: false
          });
          $scope.map.addControl($scope.geocoderSearch);

          // init map event listeners
          $scope.map.on('click', function (e) {
            var toRetrieve = [];
            if ($scope.map.getSource('searchedCity')) {
              toRetrieve.push('searchedCity');
            }
            if ($scope.map.getSource('cities')) {
              toRetrieve.push('cities');
            }
            var features = MapService.retrieveFeatures($scope.map, e, toRetrieve);
            if (!features.length) {
              return;
            }

            // save selected city values
            if (features[0].properties.bbox) {
              $scope.inSearchMode = true;
            } else {
              $scope.inSearchMode = false;
            }
            $scope.selectedCity = features[0].properties;

            // add popup
            $scope.popup = MapService.addPopup($scope.map, features[0], $scope);
          });
          $scope.map.on('mousemove', function (e) {
            var toRetrieve = [];
            if ($scope.map.getSource('searchedCity')) {
              toRetrieve.push('searchedCity');
            }
            if ($scope.map.getSource('cities')) {
              toRetrieve.push('cities');
            }
            var features = MapService.retrieveFeatures($scope.map, e, toRetrieve);
            // change cursor style
            if (!features.length) {
              MapService.changeCursor($scope.map, features, "");;
            } else {
              MapService.changeCursor($scope.map, features, "pointer");
            }
          });

          // init geocoder search event listeners
          $scope.geocoderSearch.on('result', function (e) {
            $scope.inSearchMode = true;
            $scope.searchedCity = e.result;

            // remove popup if exits
            if ($scope.popup !== undefined) {
              $scope.popup.remove();
            }
            // remove already added source
            MapService.removeSource($scope.map, "searchedCity");

            // add searched city source to map
            MapService.addSource($scope.map, "searchedCity", [{
              "type": "Feature",
              "geometry": $scope.searchedCity.geometry,
              "properties": $scope.searchedCity
            }]);

            // add searched city layer to map
            MapService.addLayer($scope.map, "searchedCity", "symbol", {
              "icon-image": "circle-15",
              "icon-allow-overlap": true
            }, {});

            // add popup for searched city
            $scope.popup = MapService.addPopup($scope.map, {
              geometry: $scope.searchedCity.geometry,
              properties: $scope.searchedCity
            }, $scope);
          });
        });
      });
    }

    $scope.initGraphics();

    $scope.init(appConfig.MAP_CENTER, appConfig.MAP_ZOOM);
  });
