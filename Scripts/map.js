// fun example of prototypical inheritance. this sets up a yellow marker that has a prototype of Google's default red marker
function yellowIcon() { };
yellowIcon.prototype = G_DEFAULT_ICON;
var yIcon = new yellowIcon();
yIcon.image = loc + "content/images/markeryellow.png";
yIcon.iconSize = new GSize(20, 34);
yIcon.iconAnchor = new GPoint(9, 34);

// global map object. makes life easy to have it global.
var g_map;

// Given a latitude/longitude, places a marker (overlay) on the map
function map_placeMarker(latlng) {
    var marker = new GMarker(latlng);
    g_map.addOverlay(marker);
}

$(function() {
    if (GBrowserIsCompatible()) {
        // Sets up GMaps, sets it to show the continental US, and finally sets up a event listener for rt clicks.
        g_map = new GMap2(document.getElementById("map_canvas"));
        g_map.setCenter(new GLatLng(39.402244, -96.591797), 3);
        g_map.setUIToDefault();
        GEvent.addListener(g_map, "singlerightclick", function(point, src, overlay) {
            // Every time you right click on the map, set a marker there and post a chat message so that the other users receive your marker.
            var latlng = g_map.fromContainerPixelToLatLng(point);
            map_placeMarker(latlng);

            ChatHelper.PostMessage("@mapmark(" + latlng.lat() + "," + latlng.lng() + ")", function() { });
        });
    }
});

// Call GMaps unload to keep away mem leaks
function jsCleanup() {
    GUnload();
}