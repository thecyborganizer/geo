Pebble.addEventListener('ready', function() {
    // PebbleKit JS is ready!
    console.log('PebbleKit JS ready!');
});

/*Pebble.addEventListener('appmessage', function(e) {
    var dict = e.payload;
    console.log('Received message from pebble: ' + JSON.stringify(dict));
    navigator.geolocation.getCurrentPosition(nav_success, nav_error, options);
});*/

var watchId;

var loc = {
    'latitude' : 0,
    'longitude' : 0,
    'distance' : 0
};
var lats = [0.0,0.0,0.0]
var lons = [0.0,0.0,0.0]
var target = {
    'latitude' : 42.400230,
    'longitude' :  -71.116427
};
var cur_distance = 0;
var msg = 'cold';
var colder_count = 0;
var warmer_count = 0;
// Choose options about the data returned
var options = {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
};

function avg(arr) {
    var sum, i;
    sum = 0.0;
    for (i = 0; i < arr.length; i++) {
        sum = sum + arr[i];
    }
    return sum/arr.length;
}

function update(arr, val){
    arr.push(val);
    return arr.splice(0,1);
}

function current_state(distance) {
    if (distance > 1000.0) {
        return 'cold';
    } else if (distance < 1000.0 && distance > 100.0) {
        return 'warm';
    } else if (distance < 100.0 && distance > 10.0) {
        return 'hot';
    } else if (distance < 10.0) {
        return 'red hot, bar'
    } else {
        return 'wut';
    }
}

function toRad(num) {
    return num * Math.PI / 180;
}

function calculate_distance(x1_deg, y1_deg, x2_deg, y2_deg) {
    var R = 6371000;
    var dx_deg = x1_deg - x2_deg;
    var dy_deg = y1_deg - y2_deg;
    var dx = toRad(dx_deg);
    var dy = toRad(dy_deg);
    var x1 = toRad(x1_deg);
    var x2 = toRad(x2_deg);
    var a = Math.sin(dx/2) * Math.sin(dx/2) + 
        Math.cos(x1) * Math.cos(x2) * Math.sin(dy/2) * Math.sin(dy/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}

function init_success(pos) {
    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;
    for (i = 0; i < 3; i++){
        lats[i] = lat;
        lons[i] = lon;
    }
    var distance = calculate_distance(lat, lon, target.latitude, target.longitude);
    cur_distance = distance;
    msg = current_state(distance);
    loc = {
        'latitude' : lat.toString().substring(0,5),
        'longitude' : lon.toString().substring(0,5),
        'distance' : distance.toString().substring(0,5),
        'msg' : msg
    };

    Pebble.sendAppMessage(loc, function() {
        console.log('Message sent successfully: ' + JSON.stringify(loc));
    }, function(e) {
        console.log('Message failed: ' + JSON.stringify(e));
    });
}
function nav_success(pos) {
    console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);

    //var lat = pos.coords.latitude.toString();
    //var lon = pos.coords.longitude.toString();

    //var lat_delta = lat - target.latitude;
    //var lon_delta = lon - target.longitude;

    var cur_avg_lat = avg(lats);
    var cur_avg_lon = avg(lons); 
    var new_lats = update(lats.splice(), pos.coords.latitude);
    var new_lons = update(lons.splice(), pos.coords.longitude);
    var new_avg_lat = avg(new_lats);
    var new_avg_lon = avg(new_lons);

    var distance = calculate_distance(new_avg_lat, new_avg_lon, target.latitude, target.longitude);

    console.log("Distance: " + distance);
    if (distance > cur_distance + 2.0 || colder_count > 0) {
        msg = 'colder';
        lats = new_lats;
        lons = new_lons;
        cur_distance = distance;
        if (colder_count == 0) {
            colder_count = 3;
        } else{
            colder_count--;
        }
        console.log('Got colder' + colder_count);
    } else if (distance < cur_distance - 2.0 || warmer_count > 0) {
        msg = 'warmer';
        lats = new_lats;
        lons = new_lons;
        cur_distance = distance;
        if (warmer_count == 0){
            warmer_count = 3;
        } else{
            warmer_count--;
        }
        console.log('Got warmer' + warmer_count);
    } else {
        msg = current_state(cur_distance);
        console.log('Stayed the same');
        change_count = 0;
    }
   
    var lat = avg(lats);
    var lon = avg(lons); 



    loc = {
        'latitude' : lat.toString().substring(0,8),
        'longitude' : lon.toString().substring(0,8),
        'distance' : (parseInt(cur_distance) % 100).toString().substring(0,8),
        'msg' : msg
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
navigator.geolocation.getCurrentPosition(init_success, nav_error, options);
watchId = navigator.geolocation.watchPosition(nav_success, nav_error, options);


