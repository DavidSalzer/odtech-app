odtechApp.directive('compass', ['$timeout', '$interval', '$rootScope', function ($timeout, $interval, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: './features/compass/compass.html',
        link: function (scope, el, attrs) {
            scope.constLocationLat = 31.787970;
            scope.constLocationLon = 35.186869;
            scope.results = {};
            scope.results.answer = [];
            scope.results.points = 0;
            scope.missionData = scope.parentMissionData;
            scope.noLocationPopupDisplayCount = 0;
            //if the mission has been made

            if (scope.missionData.status == 'answer') {
                $timeout(function () {
                    scope.firstTime = false;
                }, 0)
            }
            else {
                scope.firstTime = true;
            }
            scope.showAnswerIndication = false;
            scope.userDegrees;
            scope.destPos = [];
            scope.destName = scope.missionData.currAddress;
            scope.currentLocation = [] // = [30.990094, 34.928998]
            //get current location function
            scope.getCurrentLocation = function () {
                if (navigator.geolocation) {
                    //  navigator.geolocation.getCurrentPosition(scope.setMyPosition, scope.errorGetLocation, { timeout: 5000, enableHighAccuracy: true });
                    navigator.geolocation.watchPosition(scope.setMyPosition, scope.errorGetLocation, { timeout: 5000, enableHighAccuracy: true, frequency: 1 });

                } else {

                }
            }

            //success get current location -set the  currentLocation
            scope.setMyPosition = function (position) {
                scope.currentLocation[0] = position.coords.latitude;
                scope.currentLocation[1] = position.coords.longitude;
                scope.noLocation = false;
                scope.longNoLocation = 0;
                //set the correct azimuth

                //if the azimuth not set - set it
                //if (!isNumeric(scope.correctAzimuth)) {
                var pointA = new google.maps.LatLng(scope.currentLocation[0], scope.currentLocation[1]);
                var pointB = new google.maps.LatLng(scope.destPos[0], scope.destPos[1]);
                scope.correctAzimuth = google.maps.geometry.spherical.computeHeading(pointA, pointB) //pointA.getAzimuth(pointB);
                // }

            }

            //error in get user location.
            scope.errorGetLocation = function () {
                //  console.log('errorGetLocation')
                if (!scope.currentLocation[0] && !scope.currentLocation[1]) {
                    scope.longNoLocation += 1;
                    scope.noLocationPopupDisplayCount++;
                    scope.noLocation = true;
                }

                //scope.currentLocation[0] = scope.constLocationLat;
                //scope.currentLocation[1] = scope.constLocationLon;

                //if the azimuth not set - set it
                //  if (!isNumeric(scope.correctAzimuth)) {
                var pointA = new google.maps.LatLng(scope.currentLocation[0], scope.currentLocation[1]);
                var pointB = new google.maps.LatLng(scope.destPos[0], scope.destPos[1]);
                scope.correctAzimuth = google.maps.geometry.spherical.computeHeading(pointA, pointB)// pointA.getAzimuth(pointB);
                //  }



            }



            /*get the azimuth between the 2 points - current point and destination point*/
            google.maps.LatLng.prototype.getAzimuth = function (point) {
                var lat1 = this.lat().toRad(), lat2 = point.lat().toRad();
                var dLon = (point.lng() - this.lng()).toRad();

                var y = Math.sin(dLon) * Math.cos(lat2);
                var x = Math.cos(lat1) * Math.sin(lat2) -
           Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

                var brng = Math.atan2(y, x);

                return ((brng.toDeg() + 360) % 360);
            }



            /*init mission -1. get the correctt location 2.set the correct azimuth*/
            scope.init = function () {

                scope.destPos[0] = scope.missionData.currPin[0].latitude; //init the destination location
                scope.destPos[1] = scope.missionData.currPin[0].longitude; //init the destination location
                scope.destName = scope.missionData.currAddress; //init the destination name
                scope.getCurrentLocation(); //init the current location

                //set the location and no location popup
                scope.longNoLocation = 0;
                isLocationConnect = $interval(function () {
                    //ifthe gps NOT work
                    if (scope.lastLat == scope.currentLocation[0] && scope.lastLon == scope.currentLocation[1]) {
                        $timeout(function () {

                            scope.getCurrentLocation();
                        }, 0)
                    }
                    //if the gps work
                    else {
                        $timeout(function () {
                            scope.lastLat = scope.currentLocation[0];
                            scope.lastLon = scope.currentLocation[1];
                        }, 0)
                    }
                }, 15000);

            }
            scope.init();
            /*get compass heading callbacks*/
            scope.successGetHeading = function (heading) {
                scope.userDegrees = heading.magneticHeading;

            }
            scope.errorGetHeading = function (heading) {
                // alert('errorGetHeading');
            }

            //check if the direction that the user choose is right
            scope.checkDirection = function () {
                var x = scope.userHeading;
                var y = scope.correctAzimuth > 0 ? scope.correctAzimuth : 360 + scope.correctAzimuth; //if the correct azimuth > 0 take it. else - takse 360 - the correctazimuth
                var z;

                //if the direction is correct - end the task
                if (x - y < 30 && x - y > -30) {

                    scope.results.answer = 'success';
                    scope.taskEnd();

                }
                //if the direction is wrong
                else {

                    //if the y value is not a number- its say that there is no location- GPS not work
                    //   if (!isNumeric(y)) {
                    //show the nogps popup
                    //scope.noLocation = true;
                    // }
                    //elss - if the answer is wrong
                    //  else {
                    //play the wrong sound
                    $rootScope.$broadcast('multiQuestionAnswerWrong', {});

                    //show the wrong popup
                    scope.showAnswerIndication = true;
                    setTimeout(function () {
                        scope.showAnswerIndication = false;

                    }, 1500);

                    //  }


                }

            }

            scope.taskEnd = function () {
                //get points, if the answer was sent in time
                if (!scope.endTimer) {
                    scope.results.points = scope.missionData.points;
                }
                scope.endMission(scope.results, scope.missionData); //the param is the answers of user

            }
            scope.$on('closeMissionAndSendAnswer', function (event, data) {

                //round the results points 
                scope.results.points = Math.round(scope.results.points);
                scope.endMission(scope.results, scope.missionData);
            });


            /***init the north pointer***/
            scope.watchID;
            scope.initNorthPointer = function () {
                var options = { frequency: 500 }; // Update compass every 1 second
                scope.watchID = navigator.compass.watchHeading(scope.onSuccessWatch, scope.onErrorWatch, options);

            }
            scope.heading;
            scope.onSuccessWatch = function (heading) {
                console.log('onSuccessWatch');
                scope.userHeading = heading.magneticHeading;
                var rotation = 360 - heading.magneticHeading,
				rotateDeg = 'rotate(' + rotation + 'deg)';
                $("#compass").css('-webkit-transform', rotateDeg);

            }
            scope.onErrorWatch = function (heading) {
                console.log('on ERROR Watch')
            }
            try {
                scope.initNorthPointer();
            }
            catch (e) {
                console.log('initNorthPointer fail')
            }


            //scope.setDest = function (type) {
            //    var dest = [];
            //    switch (type) {

            //        case 1:
            //            dest = [31.789807, 35.203037]
            //            break;
            //        case 2:
            //            dest = [30.787326, 34.550059]
            //            break;
            //        case 3:
            //            dest = [30.965529, 35.255996]
            //            break;

            //    }
            //    scope.destPos = dest;

            //    //set the correct azimuth

            //    var pointA = new google.maps.LatLng(scope.currentLocation[0], scope.currentLocation[1]);
            //    var pointB = new google.maps.LatLng(scope.destPos[0], scope.destPos[1]);
            //    scope.correctAzimuth = pointA.getAzimuth(pointB);

            //}




        },
        replace: true
    };


} ]);
//[30.990094, 34.928998]-yerucham
// [31.789807, 35.203037]
// [30.787326, 34.550059]
// [30.965529, 35.255996]

Number.prototype.toRad = function () {
    return this * Math.PI / 180;
}

Number.prototype.toDeg = function () {
    return this * 180 / Math.PI;
}