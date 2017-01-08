'use strict';

/**
 * @ngdoc function
 * @name travelmapUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the travelmapUiApp
 */
angular.module('travelmapUiApp')
  .controller('MainCtrl', function ($scope, $q, MapService, CityService, CountryService) {
    $scope.totalCountries = 195;
    $scope.visitedCountries = 0;
    var map = MapService.initMap(appConfig.MAP_TOKEN, appConfig.MAP_STYLE, appConfig.MAP_CENTER);

    // init events
    map.on('load', function () {
      // retieve all visited countries
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
          var geoJSONCollection = [];
          for (var r in responses) {
            geoJSONCollection.push({
              "type": "Feature",
              "geometry": responses[r]
            });
          }
          // add source to map
          MapService.addSource(map, "countries", geoJSONCollection);

          // add layer to map
          MapService.addLayer(map, "countries", "fill", {}, {
            "fill-color": "#fff",
            "fill-opacity": 0.2
          });
        });
      }, function (reason) {
        console.error(reason);
      });

      CityService.getAllCities().then(function (cities) {
        var geoJSONCollection = [];
        for (var c in cities) {
          var city = cities[c];
          geoJSONCollection.push({
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [city.lng, city.lat]
            },
            "properties": CityService.getCityPointProperties(city)
          });
        }

        // add source to map
        MapService.addSource(map, "cities", geoJSONCollection);

        // add layer to map
        MapService.addLayer(map, "cities", "symbol", {
          "icon-image": "{icon}-15",
          "icon-allow-overlap": true
        }, {});
      });
    });

    map.on('click', function (e) {
      var features = MapService.retrieveFeatures(map, e, "cities");
      if (!features.length) {
        return;
      }

      // add popup
      MapService.addPopup(map, features[0]);
    });

    map.on('mousemove', function (e) {
      var features = MapService.retrieveFeatures(map, e, "cities");
      if (!features.length) {
        return;
      }

      // change cursor style
      MapService.changeCursor(map, features, "pointer");
    });

  });
