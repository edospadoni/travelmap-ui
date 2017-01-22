'use strict';

/**
 * @ngdoc service
 * @name travelmapUiApp.MapService
 * @description
 * # MapService
 * Service in the travelmapUiApp.
 */
angular.module('travelmapUiApp')
  .service('MapService', function ($compile) {
    this.initMap = function (center, zoom) {
      mapboxgl.accessToken = appConfig.MAP_TOKEN;
      return new mapboxgl.Map({
        container: 'map',
        style: appConfig.MAP_STYLE,
        zoom: zoom,
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

    this.updateSource = function (map, id, updated) {
      var current = map.getSource(id)._data.features;
      current.push(updated);
      map.getSource(id).setData({
        "type": "FeatureCollection",
        "features": current
      });
    };

    this.removeSource = function (map, id) {
      var source = map.getSource(id);
      if (source !== undefined) {
        map.removeSource(id);
      }
    };

    this.removeSourceElement = function (map, id, elemId) {
      var current = map.getSource(id)._data.features
      for (var c in current) {
        var delCity = current[c];
        if (delCity.properties.id === elemId) {
          delete current[c];
        }
      }

      current = current.filter(function () {
        return true;
      });

      if (current.length > 0) {
        map.getSource(id).setData({
          "type": "FeatureCollection",
          "features": current
        });
      } else {
        map.removeSource('cities');
        map.removeLayer(id);
      }
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

    this.removeLayer = function (map, id) {
      map.removeLayer(id);
    };

    this.retrieveFeatures = function (map, e, source) {
      return map.queryRenderedFeatures(e.point, {
        layers: source
      });
    };

    this.changeCursor = function (map, features, type) {
      map.getCanvas().style.cursor = type;
    };

    this.addPopup = function (map, feature, scope) {
      return new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setDOMContent($compile('<popup></popup>')(scope)[0])
        .addTo(map);
    };
  });
