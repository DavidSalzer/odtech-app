odtechApp.directive('navigation', ['$timeout', '$interval', function ($timeout, $interval) {
    return {
        restrict: 'E',
        templateUrl: './features/navigation/navigation.html',
        link: function (scope, el, attrs) {

            scope.destinationRadius = 0.0012; //distance fron destination for finish mission (need to get from server?).
            scope.destinationText = 'הברקוד נמצא בקרבת מקום, מצאו אותו וסרקו אותו'; //this text need to fet from server.

            scope.myMarker = {
                id: 1,
                coords: {},
                icon: {
                    url: './img/position2.png'
                    //size: new google.maps.Size(80, 80),
                    //origin: new google.maps.Point(50, 50)
                }
            };

            scope.map = { center: { latitude: scope.task.Latitude, longitude: scope.task.Longitude }, zoom: 14 };
            scope.options = { scrollwheel: true };

            //get current location of user.
            scope.getCurrentLocation = function () {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(scope.setMyPosition, scope.errorGetLocation, { timeout: 5000, enableHighAccuracy: true });
                } else {

                }
            }

            //init center of map in user location.
            scope.setMyPosition = function (position) {
                $timeout(function () {
                    scope.myMarker.coords.latitude = position.coords.latitude;
                    scope.myMarker.coords.longitude = position.coords.longitude;
                    console.log(scope.myMarker);
                    scope.noLocation = false;
                    scope.map = { center: { latitude: position.coords.latitude, longitude: position.coords.longitude }, zoom: 14 };
                }, 0)

            }

            //error in get user location.
            scope.errorGetLocation = function () {
                //alert('errorGetLocation');
                $timeout(function () {
                    if (!scope.map) {
                        scope.map = { center: { latitude: scope.task.Latitude, longitude: scope.task.Longitude }, zoom: 14 };
                    }
                    scope.noLocation = true;
                }, 0)

            }
            scope.getCurrentLocation();


            //mark destination on map.
            scope.destinationMarker = {
                id: 0,
                coords: {
                    latitude: scope.task.Latitude,
                    longitude: scope.task.Longitude
                },
                icon: {
                    url: './img/position4.png'
                }
            };

            //get user location while it change.
            scope.getLocation = function () {
                if (navigator.geolocation) {
                    navigator.geolocation.watchPosition(scope.showPosition, scope.errorGetLocation, { timeout: 5000, enableHighAccuracy: true });
                } else {

                }
            }

            //update user location on map.
            scope.showPosition = function (position) {
                $timeout(function () {
                    scope.myMarker.coords.latitude = position.coords.latitude;
                    scope.myMarker.coords.longitude = position.coords.longitude;
                    console.log(scope.myMarker);
                    scope.noLocation = false;
                    checkDistance(position, scope.destinationMarker);
                }, 0)

            }

            scope.getLocation();

            //pitagoras, distance between self position and destination
            function checkDistance(selfPosition, destination) {
                var x = selfPosition.coords.latitude - destination.coords.latitude;
                var y = selfPosition.coords.longitude - destination.coords.longitude;
                x2 = Math.pow(x, 2);
                y2 = Math.pow(y, 2);
                z = Math.sqrt(x2 + y2);
                if (z < scope.destinationRadius) {
                    $timeout(function () {
                        scope.isDestination = true;
                    }, 0)

                }
            }

            //exec while user click on destination btn.
            scope.sendDestination = function () {
                $timeout(function () {
                    scope.isDestination = false;
                }, 0)
            }

            //check if location is updated
            isLocationConnect = $interval(function () {
                if (scope.lastLat == scope.myMarker.coords.latitude && scope.lastLon == scope.myMarker.coords.longitude) {
                    $timeout(function () {
                        scope.noLocation = true;
                    }, 0)
                }
                else {
                    $timeout(function () {
                        scope.noLocation = false;
                        scope.lastLat = scope.myMarker.coords.latitude;
                        scope.lastLon = scope.myMarker.coords.longitude;
                    }, 0)
                }
            }, 60000);

            scope.$on('$destroy', function () {
                $interval.cancel(isLocationConnect);
                isLocationConnect = undefined;
            });
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

} ]);