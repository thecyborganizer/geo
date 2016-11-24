/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports) {

	(function(p) {
	  if (!p === undefined) {
	    console.error('Pebble object not found!?');
	    return;
	  }

	  // Aliases:
	  p.on = p.addEventListener;
	  p.off = p.removeEventListener;

	})(Pebble);


/***/ },
/* 2 */
/***/ function(module, exports) {

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




/***/ }
/******/ ]);