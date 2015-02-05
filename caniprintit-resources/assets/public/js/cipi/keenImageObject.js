define([], function() {
    'use strict';

    return function(height, width, imageName, isMobile, userAgent) {
        var data = {
            height: height,
            width: width,
            imageName: imageName,
            isMobile: isMobile,
            userAgent: userAgent
        };
        client.addEvent("imageMetaData", data);
    }
});