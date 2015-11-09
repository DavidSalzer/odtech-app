odtechApp.directive('takePhoto', ['camera', '$timeout', '$rootScope', function (camera, $timeout, $rootScope) {
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
            scope.uploadText = "בהעלאה..";
            scope.uploadTimeout = -1;



            scope.checkImagesUploadCrashes = function () {
                //if its a first time - check if the i,ages upload
                if (scope.firstTime) {
                    //for check if upload image crash
                    if (localStorage.getItem('startMission' + scope.missionData.mid) == 'start') {
                        $rootScope.$broadcast('displayGeneralPopup', { generalPopupText: 'אם לא הצלחתם לצלם תמונה, נסו להעלות תמונה מהגלריה' });
                    }

                }
            }


            scope.setData = function () {
                //clear the pictures from camera array
                camera.setPicturesAndVideos({}, {});
                /*init fields*/
                scope.isApp = isApp();
                scope.results = {};
                scope.results.answer = {};
                scope.results.points = 0;
                scope.firstTime = true;
                scope.uploadText = "בהעלאה..";
                scope.uploadTimeout = -1;



                //set the  data for mission - parent or sub
                if ($rootScope.subMissionOpen != -1) {
                    scope.missionData = $rootScope.subMissionOpen;
                }
                else {
                    scope.missionData = scope.parentMissionData;
                }
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



                        scope.checkImagesUploadCrashes()

                    }, 0)


                }

            }
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

            }

            //after the user click on the finish question popup - upload to server
            scope.uploadImages = function () {
                scope.showFinishQuestion = false;
                //show the loader on upload
                scope.showLoader = true;
                /**change the uploader text**/
                $timeout(function () {
                    scope.uploadText = "ממשיך בהעלאה..";
                }, 5000);
                $timeout(function () {
                    scope.uploadText = "ההעלאה נמשכת..";
                }, 15000);
                $timeout(function () {
                    scope.uploadText = "התמונה שלך אכותית, ההעלאה תמשך עוד כמה שניות..";
                }, 25000);
                /**end change the uploader text**/
                $timeout(function () {
                    //if the upload not finished after 50 s - end the mission -the user get all the points
                    if (scope.uploadTimeout == -1) {
                        scope.results.points = scope.missionData.points;
                        scope.results.answer = scope.pictures;
                        scope.uploadTimeout = 1;
                        console.log('endMission 1: ' + scope.results.points)
                        scope.endMission(scope.results, scope.missionData);
                    }
                }, 50000);
                //if this is a application version
                if (isApp()) {
                    camera.uploadPhoto(scope.pictures, "img", scope.missionData.countPhoto)
                            .then(function (data) {
                                //if the upload take  a long time - do nothing
                                if (scope.uploadTimeout == -1) {
                                    scope.uploadTimeout = 0;
                                    scope.showLoader = false;
                                    for (index in data) {
                                        for (field in data[index]) {
                                            scope.results.answer[field] = data[index][field];
                                            //get point, if the answer was sent in time
                                            if (!scope.endTimer) {
                                                scope.results.points = scope.missionData.points;
                                            }
                                        }
                                    }
                                    console.log('endMission 2: ' + scope.results.points)
                                    scope.endMission(scope.results, scope.missionData);

                                }

                            });
                }
                //else -if this is a browser version
                else {
                    for (form in scope.pictures) {
                        scope.pictures[form]['fd'] = new FormData(document.forms.namedItem(form));
                    }
                    camera.uploadPhotoFormData(scope.pictures, "img", scope.missionData.countPhoto)
                            .then(function (data) {
                                //if the upload take  a long time - do nothing
                                if (scope.uploadTimeout == -1) {
                                    scope.uploadTimeout = 1;
                                    scope.showLoader = false;
                                    for (index in data) {
                                        for (field in data[index]) {
                                            scope.results.answer[field] = data[index][field];
                                            //get point, if the answer was sent in time
                                            if (!scope.endTimer) {
                                                scope.results.points = scope.missionData.points;
                                            }
                                        }
                                    }
                                    //if the upload failed - get the point - by timer
                                    if(data.res ==false){
                                        console.log('upload image failed')
                                         //get point, if the answer was sent in time
                                            if (!scope.endTimer) {
                                                scope.results.points = scope.missionData.points;
                                            }
                                    }
                                    console.log('endMission 3: ' + scope.results.points)
                                    scope.endMission(scope.results, scope.missionData);
                                }


                            });

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
                        alert("סיימת את המשימה:)");
                    }
                }, 0);
            }

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
                    console.log('xxx5')
                    console.log('endMission 4: ' + scope.results.points)
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
                 if(data.data.type == "takePhoto"){
                     scope.setData()
                }
            });
        },
        replace: true
    };


    //מופיע מסך של נתינת שם לתמונה
    //אישור לשם של התמונה והתמונה עוברת למסך הראשי של הפיטצר - על כל תמונה


} ]);