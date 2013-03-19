"use strict";

var LeafletMapProvider = (function (window, undefined) {
    var _basePath;
    var picIcon;

    // map container
    var leaflet_map;

    return {
        init: function(basePath) {
            _basePath = basePath;
            
            picIcon = L.icon({
                iconUrl: _basePath + 'Content/images/markeryellow.png',
                shadowUrl: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-shadow.png',

                iconSize: [20, 34], // size of the icon
                shadowSize: [50, 64], // size of the shadow
                iconAnchor: [9, 34], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
            });

            leaflet_map = L.map('map_canvas').setView([37.7533, -94.8340], 3);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(leaflet_map);

            leaflet_map.on('contextmenu', function (e) {
                // Every time you right click on the map, set a marker there and post a chat message so that the other users receive your marker.
                LeafletMapProvider.map_placeMarker(e.latlng);
                ChatHelper.PostMessage("@mapmark(" + e.latlng.lat + "," + e.latlng.lng + ")", function () { });
            });
        },
        // Given a latitude/longitude, places a marker (overlay) on the map
        map_placeMarker: function (latlng) {
            L.marker(latlng).addTo(leaflet_map);
        },
        map_placePicMarker: function (lat, lng, clickAction) {
            var point = new L.LatLng(lat, lng);
            L.marker(point, { icon: picIcon })
                .on("click", clickAction)
                .addTo(leaflet_map);
        }
    };
}(this));