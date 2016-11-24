Pebble.addEventListener('ready', function() {
    // PebbleKit JS is ready!
    console.log('PebbleKit JS ready!');
});

/*Pebble.addEventListener('appmessage', function(e) {
    console.log('Received message from pebble');
    startWatcher();
});*/

var watchId;

var loc = {
    'latitude' : 0,
    'longitude' : 0,
    'distance' : 0
};

var target = {
    'latitude' : 42.400230,
    'longitude' :  -71.116427
};

// Choose options about the data returned
var options = {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
};

function nav_success(pos) {
    console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);

    var lat = pos.coords.latitude.toString();
    var lon = pos.coords.longitude.toString();

    var lat_delta = lat - target.latitude;
    var lon_delta = lon - target.longitude;

    var distance = Math.sqrt(lat_delta*lat_delta + lon_delta*lon_delta)*69.172;

    console.log('distance = ' + distance);

    loc = {
        'latitude' : lat.toString().substring(0,5),
        'longitude' : lon.toString().substring(0,5),
        'distance' : distance.toString().substring(0,5)
    };

    Pebble.sendAppMessage(loc, function() {
        console.log('Message sent successfully: ' + JSON.stringify(loc));
    }, function(e) {
        console.log('Message failed: ' + JSON.stringify(e));
    });
}

function nav_error(err) {
    console.log('location error (' + err.code + '): ' + err.message);
}
watchId = navigator.geolocation.watchPosition(nav_success, nav_error, options);
//navigator.geolocation.getCurrentPosition(nav_success, nav_error, options);


