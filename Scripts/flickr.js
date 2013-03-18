"use strict";

var FlickrHelper = (function (window, undefined) {
    var apiKey = "enter your api key here";
    // Iterates over size collection, looking for the given image size/type
    var findSize = function(sizes, type) {
        var foundSrc;
        $(sizes).each(function(i) {
            var size = sizes[i];
            if (size.label == type)
                foundSrc = size.source;
        });
        return foundSrc;
    };
    // Constructs the URL given a photo and the method we'd like to invoke
    var getUrl = function(photoId, method) {
        return "http://api.flickr.com/services/rest/?api_key=" + apiKey + "&method=" + method + "&photo_id=" + photoId + "&format=json&jsoncallback=?";
    };
    // Queries Flickr for the geolocation info of a photo
    var call_getLocation = function(photoId, fn) {
        $.getJSON(getUrl(photoId, "flickr.photos.geo.getLocation"), fn);
    };
    // Queries Flickr for the available sizes of a photo
    var call_getSizes = function (photoId, fn) {
        $.getJSON(getUrl(photoId, "flickr.photos.getSizes"),
            function (data) {
                // grab the thumbnail image
                var thumb_src = findSize(data.sizes.size, "Thumbnail");
                // try to find largest size available
                var orig_src = findSize(data.sizes.size, "Original") || findSize(data.sizes.size, "Large") || findSize(data.sizes.size, "Medium") || findSize(data.sizes.size, "Small");

                fn(thumb_src, orig_src);
            });
    };
    // Open a lightbox to display the large photo
    var openLightbox = function (photoId) {
        call_getSizes(photoId,
            function (thumb_src, orig_src) {
                if (undefined != orig_src)
                    $.colorbox({ href: orig_src });
            });
    };
    // Adds a photo to the message log. Used when we don't have any geolocation info.
    var addPhotoToMessageLog = function (thumb, img, userName) {
        var msgLog = $("#messageLog #msgSpace");
        var msgDiv = document.createElement("div");
        var imgr = document.createElement("img");
        imgr.src = thumb;
        $(imgr).click(function () {
            $.colorbox({ href: img });
        });
        $(msgDiv).append(imgr);
        $(msgDiv).append(" posted by " + userName);
        msgLog.append(msgDiv);
        msgLog[0].scrollTop = msgLog[0].scrollHeight;
    };
    
    return {
        // Add a photo to the map. If it doesn't have geolocation info, call addPhotoToMessageLog instead.
        addPhoto: function (photoId, userName) {
            call_getLocation(photoId,
                    function (data) {
                        if (data.stat == "fail") {
                            //we've failed out, just create div with link to pic
                            call_getSizes(photoId,
                                function (thumb_src, orig_src) {
                                    addPhotoToMessageLog(thumb_src, orig_src, userName);
                                });
                            return;
                        }

                        // we have geolocation data, put a yellow marker on the map
                        LeafletMapProvider.map_placePicMarker(data.photo.location.latitude, data.photo.location.longitude, function () {
                            openLightbox(photoId);
                        });
                    });
        },
        // Yeah, sorry. This shouldn't be in here. Just added this at the last minute. Adds an imgur photo to the message log.
        addImgurPhoto: function(photoId, userName) {
            addPhotoToMessageLog(
                "http://i.imgur.com/" + photoId + "s.jpg",
                "http://i.imgur.com/" + photoId + ".jpg",
                userName);
        }
    };
}(this));