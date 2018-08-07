odtechApp.directive('navigation', [
  '$timeout',
  '$interval',
  '$rootScope',
  '$filter',
  function($timeout, $interval, $rootScope, $filter) {
    return {
      restrict: 'E',
      templateUrl: './features/navigation/navigation.html',
      link: function(scope, el, attrs) {
        scope.constLocationLat = 31.78797;
        scope.constLocationLon = 35.186869;
        scope.showProblemPopup = false;
        scope.showHelp = true;
        scope.missionData = scope.task;
        scope.initMap = false;
        scope.destinationRadius = 0.0005; //distance fron destination for finish mission (need to get from server?).
        scope.showInterestPopup = false;
        scope.myMarker = {
          id: 1,
          coords: {},
          icon: {
            url: './img/position2.png',
            scaledSize: new google.maps.Size(50, 50)
          }
        };
        scope.map = {
          center: {
            latitude: scope.missionData.coord[0].latitude,
            longitude: scope.missionData.coord[0].longitude
          },
          zoom: 14
        };
        scope.options = { scrollwheel: true };
        scope.results = {};
        scope.results.answer;
        scope.results.points = 0;

        if (scope.missionData.status == 'answer') {
          scope.initMap = true;
          scope.showLoader = true; // show the loader until the map load finished
          scope.showHelp = false;
          $rootScope.$broadcast('showmissionLoader', { show: true });
        }
        scope.loadText = $filter('localizedFilter')('_mapLoading_');
        //  scope.showLoader = false;
        $rootScope.$broadcast('showmissionLoader', { show: false });
        //listen to map load event and then hde the loader

        //get current location of user.
        scope.getCurrentLocation = function() {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              scope.setMyPosition,
              scope.errorGetLocation,
              { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
            );
          } else {
          }
        };

        //init center of map in user location.
        scope.setMyPosition = function(position) {
          $timeout(function() {
            scope.myMarker.coords.latitude = position.coords.latitude;
            scope.myMarker.coords.longitude = position.coords.longitude;
            scope.noLocation = false;
            scope.map = {
              center: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              },
              zoom: 14
            };
          }, 0);
        };

        //error in get user location.
        scope.errorGetLocation = function() {
          scope.myMarker.coords.latitude = scope.constLocationLat;
          scope.myMarker.coords.longitude = scope.constLocationLon;
          //$timeout(function () {
          //    if (!scope.map) {
          //        scope.map = { center: { latitude: scope.missionData.Latitude, longitude: scope.missionData.Longitude }, zoom: 14 };
          //    }
          //    scope.noLocation = true;
          //}, 0)
        };
        scope.getCurrentLocation();

        ////mark destination on map.
        //the last point its the destination
        scope.destinationMarker = {
          id: 0,
          coords: {
            latitude:
              scope.missionData.coord[scope.missionData.coord.length - 1]
                .latitude,
            longitude:
              scope.missionData.coord[scope.missionData.coord.length - 1]
                .longitude
          },
          icon: {
            url: './img/position4.png',
            scaledSize: new google.maps.Size(38, 47)
          }
        };

        //set the destination marker points
        //scope.destinationMarkerIcon = { url: './img/position4.png', scaledSize: new google.maps.Size(75,93) };
        //scope.subdestinationMarkerIcon = { url: './img/subposition.png', scaledSize: new google.maps.Size(50,43) };

        //if the invisibleTarget is true - hide the destinationTarget and subdestinationTarget icons
        //  $timeout(function () {

        scope.destinationMarkerArray = scope.missionData.coord;
        scope.interestMarkerArray = scope.missionData.interestPoints;

        //  35  }, 0);
        $timeout(function() {
          //scope.subdestinationMarkerIcon = scope.missionData.invisibleTarget ? { url: './img/transparent.png', scaledSize: new google.maps.Size(1, 1)} : { url: './img/subposition.png', scaledSize: new google.maps.Size(25, 22) };
          //scope.destinationMarkerIcon = scope.missionData.invisibleTarget ? { url: './img/transparent.png', scaledSize: new google.maps.Size(1, 1)} : { url: './img/position4.png', scaledSize: new google.maps.Size(38, 47) };
          scope.subdestinationMarkerIcon = scope.missionData.invisibleTarget
            ? {
                url: './img/transparent.png',
                scaledSize: new google.maps.Size(1, 1)
              }
            : {
                url: './img/mapDisPoint.png',
                scaledSize: new google.maps.Size(38, 53)
              };
          scope.destinationMarkerIcon = scope.missionData.invisibleTarget
            ? {
                url: './img/transparent.png',
                scaledSize: new google.maps.Size(1, 1)
              }
            : {
                url: './img/mapDisPoint.png',
                scaledSize: new google.maps.Size(38, 53)
              };

          scope.destinationMarkerId = 0;
          //scope.destinationMarkerArray = scope.task.coord;
          //set theinterest marker points
          scope.interestMarkerIcon = {
            url: './img/positionIcon.png',
            scaledSize: new google.maps.Size(12, 20)
          };
          scope.interestMarkerId = 0;
        }, 0);

        //get user location while it change.
        scope.getLocation = function() {
          if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
              scope.showPosition,
              scope.errorGetLocation,
              { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
            );
          } else {
          }
        };

        //update user location on map.
        scope.showPosition = function(position) {
          $timeout(function() {
            scope.myMarker.coords.latitude = position.coords.latitude;
            scope.myMarker.coords.longitude = position.coords.longitude;
            scope.noLocation = false;
            checkDistance(position, scope.destinationMarker);
          }, 0);
        };

        scope.getLocation();

        //pitagoras, distance between self position and destination
        function checkDistance(selfPosition, destination) {
          var x = selfPosition.coords.latitude - destination.coords.latitude;
          var y = selfPosition.coords.longitude - destination.coords.longitude;
          x2 = Math.pow(x, 2);
          y2 = Math.pow(y, 2);
          z = Math.sqrt(x2 + y2);
          if (z < scope.destinationRadius) {
            $timeout(function() {
              if (!scope.endTimer) {
                scope.results.answer = 'destination';
                scope.results.points = scope.missionData.points;
              }
              scope.isDestination = true;
              $rootScope.$broadcast('reachedTheDestination', {});
            }, 0);
          }
        }

        //exec while user click on destination btn.
        scope.sendDestination = function() {
          $timeout(function() {
            if (scope.missionData.status != 'answer') {
              scope.endMission(scope.results, scope.missionData);
            }
            scope.isDestination = false;
          }, 0);
        };

        scope.$on('hideIntroduction', function() {
          //if the map not init until now- init its. -to prevent duplicate handlers,interval,etc
          if (scope.initMap == false) {
            scope.showLoader = true; // show the loader until the map load finished
            scope.initMap = true; // init the map

            $rootScope.$broadcast('showmissionLoader', { show: true });
            //check if location is updated
            scope.longNoLocation = 0;
            isLocationConnect = $interval(function() {
              navigator.geolocation.getCurrentPosition(
                scope.successGetPosByTimeout,
                scope.errorGetPosByTimeout,
                { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
              );

              //if (scope.lastLat == scope.myMarker.coords.latitude && scope.lastLon == scope.myMarker.coords.longitude) {
              // $timeout(function () {
              //     scope.noLocation = true;
              //    scope.longNoLocation += 1;
              //  }, 0)
              //}
              // else {
              // $timeout(function () {
              //     scope.noLocation = false;
              //     scope.longNoLocation = 0;
              //      scope.lastLat = scope.myMarker.coords.latitude;
              //      scope.lastLon = scope.myMarker.coords.longitude;
              //  }, 0)
              //}
            }, 15000);
          }
        });
        scope.successGetPosByTimeout = function(d) {
          $timeout(function() {
            scope.noLocation = false;
            scope.longNoLocation = 0;
            scope.lastLat = scope.myMarker.coords.latitude;
            scope.lastLon = scope.myMarker.coords.longitude;
          }, 0);
        };
        scope.errorGetPosByTimeout = function(e) {
          /*  $timeout(function () {
                scope.noLocation = true;
                scope.longNoLocation += 1;
                }, 0)*/
          scope.myMarker.coords.latitude = scope.constLocationLat;
          scope.myMarker.coords.longitude = scope.constLocationLon;
        };
        scope.$on('closeMissionAndSendAnswer', function(event, data) {
          if (
            scope.missionData.status == 'notAnswer' &&
            scope.missionData.mid == data.data.mid
          ) {
            scope.endMission(scope.results, scope.missionData);
          }
        });

        scope.$on('$destroy', function() {
          $interval.cancel(isLocationConnect);
          isLocationConnect = undefined;
        });

        scope.interestPointClick = function(index, interestMarkerArray) {
          scope.interestPopuptext = scope.missionData.interestpntsdesc[index];
          scope.showInterestPopup = true;
        };
        scope.closeNavig = function() {
          scope.endMission(scope.results, scope.missionData);
        };
      },
      replace: true
    };

    //איתחול המפה עם הקודינטות של המשימה. V
    //מירכזו מיקומי על המסך V
    //טיפול במצב של גיפאס סגור V
    //הצבת המיקום שלי ומיקום היעד V
    //במידה והמפה נטענת מאוחר V
    //, להציב גם את היעד וגם את המיקום תמיד.. V
    //לזהות התקדמות של המיקום שלי ולעדכן על המפה V
    //זיהוי התקרבות לנקודת היעד והצגת פופאפ סיום V
    //
    //כניסה אחרי ביצוע,
    //מציג את הנקודות ואת המפה
  }
]);
