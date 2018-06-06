//Check device location and send to server.
odtechApp.run([
  '$rootScope',
  'server',
  '$q',
  '$interval',
  function($rootScope, server, $q, $interval) {
    var watchLocation;
    var sendLocation;
    $rootScope.lngLocation;
    $rootScope.latLocation;
    //Start watcher for location.
    $rootScope.$on('startLocationWatcher', function(event, data) {
      //Clear old interval and watch position.
      if (sendLocation) {
        $interval.cancel(sendLocation);
      }
      if (watchLocation) {
        navigator.geolocation.clearWatch(watchLocation);
      }

      //Geolocation watch position.
      if (navigator.geolocation) {
        watchLocation = navigator.geolocation.watchPosition(
          $rootScope.showPosition,
          $rootScope.errorGetLocation,
          { maximumAge: 3000, enableHighAccuracy: true }
        );
      } else {
      }

      //All x time, send device location to server.
      sendLocation = $interval(function() {
        //  console.log('position sent ' + pos);
        if (pos && pos.coords) {
          locationRequest = {
            type: 'updateLocation',
            req: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            }
          };
          server.request(locationRequest).then(function(data) {});
        }
      }, 30000);
    });

    //Success callback of watch position.
    $rootScope.showPosition = function(loc) {
      // console.log('watcher success ' + loc);

      pos = loc;
      $rootScope.lngLocation = loc.coords.longitude;
      $rootScope.latLocation = loc.coords.latitude;
      //   console.log(new Date());
      //   console.log(loc);
    };

    //Error callback of watch position.
    $rootScope.errorGetLocation = function(err) {
      console.log('watcher failed ' + err);

      pos = err;
      $rootScope.lngLocation = -1;
      $rootScope.latLocation = -1;
      console.log(new Date());
      console.log(err);
    };

    //Stop watcher for location.
    $rootScope.$on('stopLocationWatcher', function(event, data) {
      if (sendLocation) {
        $interval.cancel(sendLocation);
      }
      if (watchLocation) {
        navigator.geolocation.clearWatch(watchLocation);
        watchLocation = null;
      }
    });
  }
]);
