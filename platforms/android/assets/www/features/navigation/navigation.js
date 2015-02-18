odtechApp.directive('navigation', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: './features/navigation/navigation.html',
        link: function (scope, el, attrs) {

            scope.destinationRadius = 0.0012; //distance fron destination for finish mission (need to get from server?).
            scope.destinationText = 'הברקוד נמצא בקרבת מקום, מצאו אותו וסרקו אותו'; //this text need to fet from server.

            scope.myMarker = {
                id: 1,
                coords: {},
                icon: './img/position2.png'
            };

            //get current location of user.
            scope.getCurrentLocation = function () {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(scope.setMyPosition);
                } else {

                }
            }

            //init center of map in user location.
            scope.setMyPosition = function (position) {
                scope.myMarker.coords.latitude = position.coords.latitude;
                scope.myMarker.coords.longitude = position.coords.longitude;
                console.log(scope.myMarker);
                scope.map = { center: { latitude: position.coords.latitude, longitude: position.coords.longitude }, zoom: 14 };
            }
            scope.getCurrentLocation();
            //scope.map = { center: { latitude: scope.task.Latitude, longitude: scope.task.Longitude }, zoom: 14 };
            scope.options = { scrollwheel: true };

            //mark destination on map.
            scope.destinationMarker = {
                id: 0,
                coords: {
                    latitude: scope.task.Latitude,
                    longitude: scope.task.Longitude
                },
                icon: './img/position4.png'
            };

            //get user location while it change.
            scope.getLocation = function () {
                if (navigator.geolocation) {
                    navigator.geolocation.watchPosition(scope.showPosition);
                } else {

                }
            }

            //update user location on map.
            scope.showPosition = function (position) {
                scope.myMarker.coords.latitude = position.coords.latitude;
                scope.myMarker.coords.longitude = position.coords.longitude;
                console.log(scope.myMarker);
                checkDistance(position, scope.destinationMarker);
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
        },
        replace: true
    };

    //איתחול המפה עם הקודינטות של המשימה. V
    //מירכזו מיקומי על המסך V
    //טיפול במצב של גיפאס סגור
    //הצבת המיקום שלי ומיקום היעד V
    //במידה והמפה נטענת מאוחר V
    //, להציב גם את היעד וגם את המיקום תמיד.. V
    //לזהות התקדמות של המיקום שלי ולעדכן על המפה
    //זיהוי התקרבות לנקודת היעד והצגת פופאפ סיום
    //
    //כניסה אחרי ביצוע,
    //מציג את הנקודות ואת המפה

} ]);