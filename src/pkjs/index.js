Pebble.addEventListener('ready', function() {
    // PebbleKit JS is ready!
    console.log('PebbleKit JS ready!');
});

/*Pebble.addEventListener('appmessage', function(e) {
    console.log('Received message from pebble');
    startWatcher();
});*/

var watchId;

var dict = {
    'latitude' : 0,
    'longitude' : 0
};

// Choose options about the data returned
var options = {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
};

function nav_success(pos) {
    console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
    dict = {
        'latitude_msb' : parseInt(pos.coords.latitude.toString().split(".")[0]),
        'latitude_lsb' : parseInt(pos.coords.latitude.toString().split(".")[1]),
        'longitude_msb' : parseInt(pos.coords.longitude.toString().split(".")[0]),
        'longitude_lsb' : parseInt(pos.coords.longitude.toString().split(".")[1])
    };
    Pebble.sendAppMessage(dict, function() {
        console.log('Message sent successfully: ' + JSON.stringify(dict));
    }, function(e) {
        console.log('Message failed: ' + JSON.stringify(e));
    });
}

function nav_error(err) {
    console.log('location error (' + err.code + '): ' + err.message);
}

navigator.geolocation.getCurrentPosition(nav_success, nav_error, options);


