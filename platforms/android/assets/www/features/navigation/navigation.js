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
        scope.showProblemPopup = false;
        scope.showHelp = true;
        scope.missionData = scope.task;
        scope.hideMap = scope.missionData.hiddenMap;

        scope.noLocationPopupDisplayCount = 0;
        scope.destinationsPointsHide = !scope.missionData.invisibleTarget; // detect if hide the destination points
        scope.interestPointsHide = scope.missionData.checkInvisibleIP; // detect if hide the interest points
        scope.interestPopupJumpByDistance = scope.missionData.checkIsNear; //detect if popup jump near the point
        scope.interestPopupJumpByClick = scope.missionData.checkPopup; //detect if popup jump on click the point
        scope.interestPopupRadius = 0.05; //20m :0.02 // distance by admin
        scope.destinationMarkerArray = scope.missionData.coord; //destination points
        scope.interestMarkerArray = scope.missionData.interestPoints; //interest points
        scope.initMap = false;
        scope.destinationRadius = 0.0005; //distance fron destination for finish mission (need to get from server?).
        scope.showInterestPopup = false;
        scope.popupShownIndexes = [];
        scope.myMarker = {
          id: 1,
          coords: {},
          icon: {
            url: './img/position2.png'
          }
        };
        scope.center = new google.maps.LatLng(
          scope.missionData.coord[0].latitude,
          scope.missionData.coord[0].longitude
        );
        // google.maps.event.trigger(scope.map, 'resize');
        scope.mapZoom = 14;

        scope.options = { scrollwheel: true }; //mapTypeId:google.maps.MapTypeId.SATELLITE : for SATELLITE display
        scope.results = {};
        scope.results.answer = [];
        scope.results.points = 0;

        if (scope.missionData.status == 'answer') {
          scope.initMap = true;
          scope.showLoader = true; // show the loader until the map load finished
          scope.showHelp = false;
          $rootScope.$broadcast('showmissionLoader', { show: true });
        }
        scope.loadText = $filter('localizedFilter')('_mapLoading_');
        $rootScope.$broadcast('showmissionLoader', { show: false });
        //listen to map load event and then hide the loader
        scope.mapLoaded = function(map) {
          scope.map = map;
          scope.showLoader = false;
          $rootScope.$broadcast('showmissionLoader', { show: false });
        };

        //init center of map in user location.
        scope.setMyPosition = function() {
          $timeout(function() {
            if ($rootScope.latLocation != -1 && $rootScope.lngLocation != -1) {
              scope.myMarker.coords.latitude = $rootScope.latLocation;
              scope.myMarker.coords.longitude = $rootScope.lngLocation;
            }
            scope.center = new google.maps.LatLng(
              $rootScope.latLocation,
              $rootScope.lngLocation
            );
            scope.noLocation = false;
            // google.maps.event.trigger(scope.map, 'resize');
          }, 0);
        };
        //error in get user location.
        scope.errorGetLocation = function() {
          $timeout(function() {
            scope.center = new google.maps.LatLng(
              scope.missionData.Latitude,
              scope.missionData.Longitude
            );
            // google.maps.event.trigger(scope.map, 'resize');
            scope.noLocationPopupDisplayCount++;
            scope.noLocation = true;
          }, 1000);
        };

        //get current location of user - one time?
        scope.getCurrentLocation = function() {
          if ($rootScope.lngLocation != -1) {
            scope.setMyPosition();
          } else {
            scope.errorGetLocation();
          }

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              scope.setMyPosition,
              scope.errorGetLocation,
              { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
            );
          } else {
          }
        };
        scope.getCurrentLocation();

        scope.destinationMarkerArray = scope.missionData.coord; //set the destination points array
        scope.interestMarkerArray = scope.missionData.interestPoints; //set the interest points array

        //update user location on map.
        scope.showPosition = function() {
          $timeout(function() {
            if ($rootScope.latLocation != -1 && $rootScope.lngLocation != -1) {
              scope.myMarker.coords.latitude = $rootScope.latLocation;
              scope.myMarker.coords.longitude = $rootScope.lngLocation;
            }
            //console.log(scope.myMarker);
            scope.noLocation = false;
            var finalDesCoords = {
              latitude:
                scope.missionData.coord[scope.missionData.coord.length - 1]
                  .latitude,
              longitude:
                scope.missionData.coord[scope.missionData.coord.length - 1]
                  .longitude
            };

            checkDistance(finalDesCoords);
          }, 0);
        };

        //pitagoras, distance between self position and destination
        function checkDistance(destination) {
          var x = $rootScope.latLocation - destination.latitude;
          var y = $rootScope.lngLocation - destination.longitude;
          var z;
          x2 = Math.pow(x, 2);
          y2 = Math.pow(y, 2);
          z = Math.sqrt(x2 + y2);

          if (z < scope.destinationRadius) {
            $timeout(function() {
              if (!scope.endTimer) {
                scope.results.answer = 'destination';
                scope.results.points = scope.missionData.points;
              }
              //play the ring once
              if (scope.isDestination != true) {
                $rootScope.$broadcast('reachedTheDestination', {});
              }

              scope.isDestination = true;
            }, 0);
          }

          //check the interest points distance -for jump popup
          if (scope.interestPopupJumpByDistance) {
            scope.checkInterestPointsDistance();
          }
        }

        scope.calculateDistance = function(destinationCoords) {
          var x = $rootScope.latLocation - destinationCoords.latitude;
          var y = $rootScope.lngLocation - destinationCoords.longitude;
          var z;
          x2 = Math.pow(x, 2);
          y2 = Math.pow(y, 2);
          z = Math.sqrt(x2 + y2);
          z = z * 100; // in meters
          return z;
        };

        scope.checkInterestPointsDistance = function() {
          //pass over the array of interest points and check if one of them near the user.
          for (var i = 0; i < scope.interestMarkerArray.length; i++) {
            //check the interest point distance
            var distance = scope.calculateDistance(
              scope.interestMarkerArray[i]
            );
            //if the user near the point
            if (
              distance < scope.interestPopupRadius &&
              scope.popupShownIndexes[i] != true
            ) {
              //set the interest point text and show the popup
              scope.interestPopuptext = scope.missionData.interestpntsdesc[i];
              scope.popupShownIndexes[i] = true;
              $timeout(function() {
                scope.showInterestPopup = true;
              }, 0);
            }
          }
        };

        //exec while user click on destination btn.
        scope.sendDestination = function() {
          $timeout(function() {
            if (scope.missionData.status != 'answer') {
              console.log('xxx1');
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

            console.log('4+ scope.missionData: ' + scope.missionData.type);
            $rootScope.$broadcast('showmissionLoader', { show: true });
            //check if location is updated
            scope.longNoLocation = 0;
            //check the location.
            //if the GPS not working- show an error message
            isLocationConnect = $interval(function() {
              //  navigator.geolocation.getCurrentPosition(scope.showPosition, scope.errorGetLocation, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true })
              if ($rootScope.lngLocation != -1) {
                scope.showPosition();
              } else {
                scope.errorGetLocation();
              }
            }, 3000);
          }
        });

        scope.$on('closeMissionAndSendAnswer', function(event, data) {
          if (
            scope.missionData.status == 'notAnswer' &&
            scope.missionData.mid == data.data.mid
          ) {
            console.log('xxx2');
            scope.endMission(scope.results, scope.missionData);
          }
        });

        scope.$on('$destroy', function() {
          $interval.cancel(isLocationConnect);
          isLocationConnect = undefined;
        });

        scope.hideInterestPointPopup = function() {
          scope.showInterestPopup = false;
        };

        scope.interestPointClick = function(interestMarkerArray, index) {
          //if the interest point have to show popup by click- show it
          if (scope.interestPopupJumpByClick) {
            scope.interestPopuptext = scope.missionData.interestpntsdesc[index];
            $timeout(function() {
              scope.showInterestPopup = true;
            }, 0);
          }
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
