odtechApp.directive('navigation', [function () {
    return {
        restrict: 'E',
        templateUrl: './features/navigation/navigation.html',
        link: function (scope, el, attrs) {

            scope.myMarker = {
                id: 1,
                coords: {}
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
                }
                
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
            }

            scope.getLocation();
        },
        replace: true
    };

    //איתחול המפה עם הקודינטות של המשימה.
    //מירכזו מיקומי על המסך
    //טיפול במצב של גיפאס סגור
    //הצבת המיקום שלי ומיקום היעד
    //במידה והמפה נטענת מאוחר
    //, להציב גם את היעד וגם את המיקום תמיד..
    //לזהות התקדמות של המיקום שלי ולעדכן על המפה
    //זיהוי התקרבות לנקודת היעד והצגת פופאפ סיום
    //
    //כניסה אחרי ביצוע,
    //מציג את הנקודות ואת המפה

} ]);