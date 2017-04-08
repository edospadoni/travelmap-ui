# TravelMap UI

### Description
This is a sample AngularJS application to show all yours visited city in the world. It can be used as a frontend for the [TravelMap API].

It uses [MapBox] as a map engine.

### Demo
[Example]

### Configuration
Get a valid MapBox `access token`. Follow the guide [here]

Edit the file `app/scripts/config.js` and specify your configuration:
```
var appConfig = {
    // is the API token of MapBox
    MAP_TOKEN: 'YOUR-MAPBOX-TOKEN',
    // is the center of the map (currently in Italy)
    MAP_CENTER: [20.9027835, 44.4963655],
    MAP_ZOOM: 2,
    // specify different themes for the map (search on mapbox)
    MAP_STYLE: 'mapbox://styles/mapbox/dark-v9',
    // is the url of the TravelMap API
    MAP_API_SOURCE: 'YOUR-BACKEND-API-URL'
};
```

### Build
Install `bower` and `grunt`

`npm install -g grunt bower`


Install the JavaScript dependecies (`node_modules` and `bower_components`)

`npm install && bower install`

### Use
Launch the application

`grunt serve`

### Deploy
Compress the application for production

`grunt build`

[TravelMap API]:https://github.com/edospadoni/travelmap-api
[here]:https://www.mapbox.com/help/create-api-access-token/
[MapBox]:https://www.mapbox.com/
[Example]:https://edospadoni.github.io/travels/#!/
