odtechApp.directive('takeVideo', ['camera', '$timeout', function (camera, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './features/takeVideo/takeVideo.html',
        link: function (scope, el, attrs) {

            scope.videoSaved = {};
            scope.videos = {};
            scope.videoCenter = 'videoCenter';
            scope.videoUp = 'videoUp';
            scope.videoDown = 'videoDown';
            scope.videoLeft = 'videoLeft';
            scope.videoRight = 'videoRight';
            scope.countVideos = 0;
            scope.task.countVideo = 1;
            scope.showFinishQuestion = false;
            scope.isApp = isApp();
            scope.uploadText = "בהעלאה..";
            scope.uploadTimeout = -1; // is it timeout on upload
            scope.results = {};
            scope.results.answer = {};
            scope.results.points = 0;
            scope.firstTime = true;
            scope.showLoader = false;
            //check if this first time that we doing the mission or we made it before
            if (scope.task.status == 'answer') {
                $timeout(function () {
                    scope.firstTime = false;
                    //scope.task.answer.data = scope.task.answer.data;
                    for (video in scope.task.answer.data) {
                        scope.videoSaved[video] = true;
                        //if the url is local path ( the upload timeout ) - take it without domain url
                        if (scope.task.answer.data[video].uri ) {
                            scope.videos[video] = scope.task.answer.data[video];
                        }
                        else {
                            scope.videos[video] = { uri: imgDomain + scope.task.answer.data[video] };
                        }
                        //set the video src
                        $('#capture-video-clip').append('<video class="fullMovie" id="fullMovieClip" controls > <source src="' + scope.videos[video].uri + '" type="video/mp4" /></video>');
                    }
                }, 0)
            }

            // take video -from camera
            scope.captureVideo = function (videoClicked) {
                camera.captureVideo(videoClicked)
                .then(function (data) {
                    $timeout(function () {
                        //get the videos from camera service
                        scope.videos = camera.getVideos();
                        //set the video that capture on the dom
                        $('#capture-video-clip').append('<video class="fullMovie" id="fullMovieClip" controls poster="img/poster.png"> <source src="' + scope.videos['videoCenter'].uri + '" type="video/mp4" /></video>');
                        scope.videoClicked = videoClicked;
                        if (scope.videoSaved[scope.videoClicked] == true) {
                            scope.countVideos--;
                        }
                        scope.videoSaved[scope.videoClicked] = true;
                        scope.countVideos++;
                         //if the user take the last video - display the "is finished question popup"
                        if (scope.countVideos == scope.task.countVideo) {
                              scope.showFinishQuestion = true;

                        }
                    }, 0);
                });
            }

            scope.uploadVideo = function () {
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
                    scope.uploadText = "ההעלאה תמשך עוד כמה שניות..";
                }, 25000);
                /**end change the uploader text**/
                $timeout(function () {
                    //if the upload not finished after 50 s - end the mission
                    if (scope.uploadTimeout == -1) {
                        scope.results.points = scope.task.points;
                        scope.results.answer = scope.videos; //set the video with the local path
                        scope.uploadTimeout = 1;
                        scope.endMission(scope.results);
                    }
                }, 50000);
                camera.uploadPhoto(scope.videos, "video", 1)
                            .then(function (data) {
                                //if the upload take  a long time - do nothing - the mission ended by the timeout
                                if (scope.uploadTimeout == -1) {
                                    scope.uploadTimeout = 0;

                                    for (index in data) {
                                        for (field in data[index]) {
                                            scope.results.answer[field] = data[index][field];
                                            //get point, if the answer was sent in time
                                            if (!scope.endTimer) {
                                                scope.results.points = scope.task.points;
                                            }
                                        }
                                    }
                                    scope.endMission(scope.results);
                                }

                            });
            }

            // take video in browser
            scope.browserCaptureVideo = function (video, videoClicked) {
                $timeout(function () {
                    scope.videos[videoClicked] = { uri: window.URL.createObjectURL(video[0]) };
                    $('#capture-video-clip').append('<video class="fullMovie" id="fullMovieClip" controls poster="img/poster.png"> <source src="' + scope.videos['videoCenter'].uri + '" type="video/mp4" /></video>');
                    scope.videoClicked = videoClicked;
                    if (scope.videoSaved[scope.videoClicked] == true) {
                        scope.countVideos--;
                    }
                    scope.videoSaved[scope.videoClicked] = true;
                    scope.countVideos++;
                    if (scope.countVideos == scope.task.countVideo) {
                       for (form in scope.videos) {
                            scope.videos[form]['fd'] = new FormData(document.forms.namedItem(form));
                        }
                       camera.uploadPhotoFormData(scope.videos, "video", 1)
                            .then(function (data) {
                                for (index in data) {
                                    for (field in data[index]) {
                                        scope.results.answer[field] = data[index][field];
                                        //get point, if the answer was sent in time
                                        if (!scope.endTimer) {
                                            scope.results.points = scope.task.points;
                                        }
                                    }
                                }
                                scope.endMission(scope.results);
                            });
                    }
                }, 0);
            }

            // delete video - the user click on X btn
            scope.deleteVideo = function (videoClicked) {
                scope.showFinishQuestion = false; //hide the finish question
                camera.deleteVideo(videoClicked);
                $timeout(function () {
                    scope.videos = camera.getVideos();
                    $('#fullMovieClip').remove();
                    scope.videoSaved[videoClicked] = false;
                    scope.countVideos--;
                }, 0);
            }
           

            scope.$on('closeMission', function (event, data) {
                scope.endMission(scope.results);
            });

        },
        replace: true
    };


    //מופיע מסך של נתינת שם לוידאו
    //אישור לשם של הוידאו והוא עובר למסך הראשי של הפיטצר
  

} ]);