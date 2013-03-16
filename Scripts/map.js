var picIcon = L.icon({
    iconUrl: loc + 'Content/images/markeryellow.png',
    shadowUrl: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-shadow.png',

    iconSize: [20, 34], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [9, 34], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

// global map object. makes life easy to have it global.
var g_map;

// Given a latitude/longitude, places a marker (overlay) on the map
function map_placeMarker(latlng) {
    var marker = L.marker(latlng).addTo(g_map);
}

$(function () {

    g_map = L.map('map_canvas').setView([37.7533, -94.8340], 3);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(g_map);

    g_map.on('contextmenu', function (e) {
        // Every time you right click on the map, set a marker there and post a chat message so that the other users receive your marker.
        map_placeMarker(e.latlng);
        ChatHelper.PostMessage("@mapmark(" + e.latlng.lat + "," + e.latlng.lng + ")", function () { });
    });
});