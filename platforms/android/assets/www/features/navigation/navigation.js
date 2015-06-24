odtechApp.directive('navigation', ['$timeout', '$interval', '$sce', '$rootScope', function ($timeout, $interval, $sce, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: './features/navigation/navigation.html',
        link: function (scope, el, attrs) {
            $rootScope.isSubMission = false;
            scope.initMap = false;
            scope.destinationRadius = 0.0005; //distance fron destination for finish mission (need to get from server?).
            //scope.destinationText = 'הברקוד נמצא בקרבת מקום, מצאו אותו וסרקו אותו'; //this text need to get from server.
            scope.showInterestPopup = false;
            scope.imgDomain = imgDomain;


            scope.myMarker = {
                id: 1,
                coords: {},
                icon: {
                    url: './img/position2.png',
                    //size: new google.maps.Size(80, 80),
                    scaledSize: new google.maps.Size(75, 93)
                    //origin: new google.maps.Point(50, 50)
                }
            };


            //if the mission has been made
            scope.firstTime = true;
            if (scope.task.status == 'answer') {

                $timeout(function () {
                    scope.firstTime = false;
                    scope.initMap = true;
                }, 0)
            }
            //scope.map = { center: { latitude: scope.task.Latitude, longitude: scope.task.Longitude }, zoom: 14 };
            scope.map = { center: { latitude: scope.task.coord[0].latitude, longitude: scope.task.coord[0].longitude }, zoom: 14 };
            scope.options = { scrollwheel: true };

            scope.results = {};
            scope.results.answer;
            scope.results.points = 0;

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
                    // console.log(scope.myMarker);
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


            ////mark destination on map.
            //the last point its the destination
            scope.destinationMarker = {
                id: 0,
                coords: {
                    latitude: scope.task.coord[scope.task.coord.length - 1].latitude,
                    longitude: scope.task.coord[scope.task.coord.length - 1].longitude
                },
                icon: {
                    url: './img/position4.png',
                    scaledSize: new google.maps.Size(75, 93)
                }
            };

            //set the destination marker points
            scope.destinationMarkerArray = scope.task.coord;
            scope.interestMarkerArray = scope.task.interestPoints;
            $timeout(function () {

                scope.subdestinationMarkerIcon = scope.task.invisibleTarget ? { url: './img/transparent.png', scaledSize: new google.maps.Size(1, 1)} : { url: './img/subposition.png', scaledSize: new google.maps.Size(50, 43) };
                scope.destinationMarkerIcon = scope.task.invisibleTarget ? { url: './img/transparent.png', scaledSize: new google.maps.Size(1, 1)} : { url: './img/position4.png', scaledSize: new google.maps.Size(75, 93) };


                scope.destinationMarkerId = 0;
                //set theinterest marker points
                scope.interestMarkerIcon = { url: './img/positionIcon.png', scaledSize: new google.maps.Size(20, 20) };
                scope.interestMarkerId = 0;

            }, 0);


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
                    //console.log(scope.myMarker);
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
                        if (!scope.endTimer) {
                            scope.results.answer = 'destination';
                            scope.results.points = scope.task.points;
                        }
                        scope.isDestination = true;
                        $rootScope.$broadcast('reachedTheDestination', {});
                    }, 0)

                }
            }

            //exec while user click on destination btn.
            scope.sendDestination = function () {
                $timeout(function () {
                    //if (scope.task.status != 'answer' && !scope.endTimer) {
                    if (scope.task.status != 'answer') {
                        scope.endMission(scope.results);
                    }
                    scope.isDestination = false;
                }, 0)
            }

            scope.$on('startMission', function () {
                scope.initMap = true;
                //check if location is updated
                scope.longNoLocation = 0;
                isLocationConnect = $interval(function () {
                    if (scope.lastLat == scope.myMarker.coords.latitude && scope.lastLon == scope.myMarker.coords.longitude) {
                        $timeout(function () {
                            scope.noLocation = true;
                            scope.longNoLocation += 1;
                        }, 0)
                    }
                    else {
                        $timeout(function () {
                            scope.noLocation = false;
                            scope.longNoLocation = 0;
                            scope.lastLat = scope.myMarker.coords.latitude;
                            scope.lastLon = scope.myMarker.coords.longitude;
                        }, 0)
                    }
                }, 15000);
            });

            scope.$on('closeMission', function (event, data) {
                scope.endMission(scope.results);
            });


            scope.$on('$destroy', function () {
                $interval.cancel(isLocationConnect);
                isLocationConnect = undefined;
                $rootScope.isSubMission = false;
            });

            scope.interestPointClick = function (index, interestMarkerArray) {
                scope.interestPopuptext = scope.task.interestpntsdesc[index];
                scope.showInterestPopup = true;
            }



            /**********sub missions section***************/

            scope.hasSubMission = true;
            scope.currentSubMission = "";
            scope.cameraFrameShow = false;
            scope.questionFrameShow = false;
            scope.videoFrameShow = false;
            scope.cameraFrameUrl = 'index.html#/mission/';
            scope.questionFrameUrl = 'index.html#/mission/';
            scope.videoFrameUrl = 'index.html#/mission/';


            scope.$on('closeSubMission', function (event, data) {

            });


            scope.openSubMission = function (mission) {
                var url = $sce.trustAsResourceUrl('index.html#/mission/' + mission.mid); ;
                switch (mission.type) {
                    case "takePhoto":
                        scope.cameraFrameUrl = url;
                        scope.cameraFrameShow = true
                        break;
                    case "takeVideo":
                        scope.videoFrameUrl = url;
                        scope.videoFrameShow = true
                        break;
                    case "openQuestion":
                        scope.questionFrameUrl = url;
                        scope.questionFrameShow = true
                        break;
                }
                // scope.cameraFrameUrl = $sce.trustAsResourceUrl('index.html#/mission/' + mission.mid);
                scope.currentSubMission = mission.type;
                $rootScope.isSubMission = true;

                //add the relevant css

            }

            scope.closeSubMission = function (task) {
                $timeout(function () {
                    $rootScope.isSubMission = false;
                    scope.cameraFrameShow = false

                    scope.videoFrameShow = false

                    scope.questionFrameShow = false
                }, 0)

                //add the relevant css

            }

            scope.loadCss = function (type) {
                var cssLinkCamera = document.createElement("link");
                cssLinkCamera.href = "css/subMissions.css"; cssLinkCamera.rel = "stylesheet";
                cssLinkCamera.type = "text/css";
                
                var cssLinkVideo = document.createElement("link");
                cssLinkVideo.href = "css/subMissions.css"; cssLinkVideo.rel = "stylesheet";
                cssLinkVideo.type = "text/css";
                
                var cssLinkQuestion = document.createElement("link");
                cssLinkQuestion.href = "css/subMissions.css"; cssLinkQuestion.rel = "stylesheet";
                cssLinkQuestion.type = "text/css";
                $timeout(function () {

                    document.getElementById("subMissionCameraFrame").contentWindow.document.body.appendChild(cssLinkCamera);
                    document.getElementById("subMissionQuestionFrame").contentWindow.document.body.appendChild(cssLinkQuestion);
                    document.getElementById("subMissionVideoFrame").contentWindow.document.body.appendChild(cssLinkVideo);
                  
                }, 3000)

            }
            scope.loadCss()
            //if you finish mission hide -by parent mission or by subMission - hide the subMission
            scope.$on('finishMissionHide', function (event, data) {
                $rootScope.isSubMission = false;
            });
            scope.$on('closeMissionAnswered', function (event, data) {
                $rootScope.isSubMission = false;
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

