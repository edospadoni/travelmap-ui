'use strict';

/**
 * @ngdoc service
 * @name travelmapUiApp.MapService
 * @description
 * # MapService
 * Service in the travelmapUiApp.
 */
angular.module('travelmapUiApp')
  .service('MapService', function () {
    this.initMap = function (token, style, center) {
      mapboxgl.accessToken = token;
      return new mapboxgl.Map({
        container: 'map',
        style: style,
        zoom: 2,
        minZoom: 2,
        maxZoom: 7,
        center: center
      });
    };

    this.addSource = function (map, id, collection) {
      map.addSource(id, {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": collection
        }
      });
    };

    this.addLayer = function (map, source, type, layout, paint) {
      map.addLayer({
        "id": source,
        "type": type,
        "source": source,
        "layout": layout,
        "paint": paint
      });
    };

    this.retrieveFeatures = function (map, e, source) {
      return map.queryRenderedFeatures(e.point, {
        layers: [source]
      });
    };

    this.changeCursor = function(map, features, type) {
      map.getCanvas().style.cursor = (features.length) ? type : '';
    };

    this.addPopup = function (map, feature) {
      return new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML(feature.properties.description)
        .addTo(map);
    };
  });
