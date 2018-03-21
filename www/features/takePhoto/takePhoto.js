odtechApp.directive('takePhoto', ['camera', '$timeout', '$rootScope', '$filter', function (camera, $timeout, $rootScope, $filter) {
    return {
        restrict: 'E',
        templateUrl: './features/takePhoto/takePhoto.html',
        scope: true,
        link: function (scope, el, attrs) {
            scope.missionData;
            scope.photoSaved = {};
            scope.pictures = {};
            scope.photoCenter = 'photoCenter';
            scope.photoUp = 'photoUp';
            scope.photoDown = 'photoDown';
            scope.photoLeft = 'photoLeft';
            scope.photoRight = 'photoRight';
            scope.countPhotos = 0;
            scope.showFinishQuestion = false;
            scope.showLoader = false;

            scope.isApp = isApp();
            scope.results = {};
            scope.results.answer = {};
            scope.results.points = 0;
            scope.firstTime = true;
            scope.uploadText = $filter('localizedFilter')('_uploading_');
            scope.uploadTimeout = -1;



            scope.checkImagesUploadCrashes = function () {
                //if its a first time - check if the i,ages upload
                if (scope.firstTime) {
                    //for check if upload image crash
                    if (localStorage.getItem('startMission' + scope.missionData.mid) == 'start') {
                        $rootScope.$broadcast('displayGeneralPopup', { generalPopupText: $filter('localizedFilter')('_uploadImageTip_')                    });
                    }

                }
            };


            scope.setData = function () {
                //clear the pictures from camera array
                camera.setPicturesAndVideos({}, {});
                /*init fields*/
                scope.isApp = isApp();
                scope.results = {};
                scope.results.answer = {};
                scope.results.points = 0;
                scope.firstTime = true;
                scope.uploadText = $filter('localizedFilter')('_uploading_');
                scope.uploadTimeout = -1;


                //set the  data for mission - parent or sub
                if ($rootScope.subMissionOpen != -1) {
                    scope.missionData = $rootScope.subMissionOpen;
                }
                else {
                    scope.missionData = scope.parentMissionData;
                }
                //set the minimal count photo if not exist
                scope.missionData.countPhoto = scope.missionData.countPhoto != undefined && scope.missionData.countPhoto.length == 0 ? 1 :  scope.missionData.countPhoto && scope.missionData.countPhoto > 5 ? 5 :scope.missionData.countPhoto;

                if (scope.missionData.status == 'answer') {


                    $timeout(function () {
                        scope.firstTime = false;
                        scope.missionData.answer.data = scope.missionData.answer.data;
                        for (pic in scope.missionData.answer.data) {

                            scope.photoSaved[pic] = true;
                            //if the url is local path ( the upload timeout ) - take it without domain url
                            if (scope.missionData.answer.data[pic].uri) {
                                scope.pictures[pic] = scope.missionData.answer.data[pic];
                            }
                            //else - take the domain+url from server
                            else {
                                scope.pictures[pic] = { uri: imgDomain + scope.missionData.answer.data[pic] };
                            }

                        }



                        scope.checkImagesUploadCrashes();

                    }, 0);


                }

            };
            scope.setData();


            //check if this first time that we doing the mission or we made made it befor


            // take photo from camera
            scope.captureImage = function (photoClicked) {
                camera.captureImage(photoClicked)
                .then(function (data) {
                    $timeout(function () {
                        //get the pictures from camera service
                        scope.pictures = camera.getPictures();
                        scope.photoClicked = photoClicked;
                        scope.openImg = false;
                        scope.photoSaved[scope.photoClicked] = true;
                        //count the photos that took
                        scope.countPhotos++;
                        if (scope.countPhotos == scope.missionData.countPhoto || scope.missionData.countPhoto == undefined) {
                            //if the user take the last photo - display the "is finished question popup"

                            $timeout(function () {
                                scope.showFinishQuestion = true;
                            }, 0);
                        }
                    }, 0);
                });
            }

            // take photo in browser
            scope.browserCaptureImage = function (photo, photoClicked) {
                $timeout(function () {
                    scope.pictures[photoClicked] = { uri: window.URL.createObjectURL(photo[0]) };
                    scope.photoClicked = photoClicked;
                    scope.openImg = false;
                    scope.photoSaved[scope.photoClicked] = true;
                    //count the photos that took
                    scope.countPhotos++;
                    if (scope.countPhotos == scope.missionData.countPhoto) {
                        //alert("סיימת את המשימה:)");
                        //if the user take the last photo - display the "is finished question popup"

                        $timeout(function () {
                            scope.showFinishQuestion = true;
                        }, 0);
                    }
                }, 0);

            };

            //after the user click on the finish question popup - upload to server
            scope.uploadImages = function () {
                scope.showFinishQuestion = false;

                //if this is a application version
                if (isApp()) {
                    camera.uploadPhoto(scope.pictures, "img", scope.missionData.countPhoto)
                            .then(function (data) {


                            });
                    //set the images with the local path
                    scope.results.answer = scope.pictures;
                    //if not timeout - set the points
                    if (!scope.endTimer) {
                        scope.results.points = scope.missionData.points;
                    }
                    //end the mission without connection to the upload
                    scope.endMission(scope.results, scope.missionData);
                }
                //else -if this is a browser version
                else {
                    for (form in scope.pictures) {
                        scope.pictures[form]['fd'] = new FormData(document.forms.namedItem(form));
                    }
                    camera.uploadPhotoFormData(scope.pictures, "img", scope.missionData.countPhoto)
                            .then(function (data) {



                            });
                    //set the images with the local path
                    scope.results.answer = scope.pictures;
                    //if not timeout - set the points
                    if (!scope.endTimer) {
                        scope.results.points = scope.missionData.points;
                    }
                    //end the mission without connection to the upload
                    scope.endMission(scope.results, scope.missionData);

                }
            }
            // add description to photo - not use in this version
            scope.addDescription = function () {
                camera.addDescription(scope.description);
                scope.description = '';
                $timeout(function () {
                    scope.openImg = false;
                    scope.photoSaved[scope.photoClicked] = true;
                    scope.countPhotos++;
                    if (scope.countPhotos == scope.missionData.countPhoto) {
                        alert(cid === 3? $filter('localizedFilter')('_missionAccomplishedOrpan_') : $filter('localizedFilter')('_missionAccomplished_')
                    );
                    }
                }, 0);
            };

            // delete photo - the user click on X btn
            scope.deletePhoto = function (photoClicked) {
                camera.deletePhoto(photoClicked);
                $timeout(function () {
                    if (isApp()) {
                        scope.pictures = camera.getPictures();
                    } else {
                        scope.pictures[photoClicked] = undefined;
                    }
                    scope.photoSaved[photoClicked] = false;
                    scope.countPhotos--;
                    scope.showFinishQuestion = false;
                }, 0);
            }


            /**for browsers**/
            scope.imageChosen = function (input) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function (e) {

                    }

                    reader.readAsDataURL(input.files[0]);
                }
            }
            /** END for browsers**/

            scope.$on('closeMissionAndSendAnswer', function (event, data) {
                //send answer to server if the current if this is the mission that close
                if (scope.missionData.status == "notAnswer" && scope.missionData.mid == data.data.mid) {
                    scope.endMission(scope.results, scope.missionData);
                    localStorage.removeItem('startMission' + scope.missionData.mid); //for check if upload image crash
                }
            });





            scope.clickOnImage = function () {
                if (localStorage.getItem('startMission' + scope.missionData.mid) == 'start') {
                    //localStorage.removeItem('startMission' + scope.task.mid);
                }
                else {
                    localStorage.setItem('startMission' + scope.missionData.mid, 'start');
                }
            }

            /*submission data*/
            //addon for submission because the controller is alive
            scope.$on('subMissionDataGet', function (event, data) {
                if (data.data.type == "takePhoto") {
                    scope.setData();
                }
            });
        },
        replace: true
    };


    //מופיע מסך של נתינת שם לתמונה
    //אישור לשם של התמונה והתמונה עוברת למסך הראשי של הפיטצר - על כל תמונה


} ]);