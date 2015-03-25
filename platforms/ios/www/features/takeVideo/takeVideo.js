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

            scope.results = {};
            scope.results.answer={};
            scope.results.points = 0;
            scope.firstTime = true;
            //check if this first time that we doing the mission or we made made it befor
            if (scope.task.status == 'answer') {
                //alert('This task has been made');
                //scope.videos = camera.getVideos();
                $timeout(function () {
                    scope.firstTime = false;
                    scope.task.answer.data = JSON.parse(scope.task.answer.data);
                    for (video in scope.task.answer.data) {
                        scope.videoSaved[video] = true;
                        scope.videos[video] = { uri: imgDomain + scope.task.answer.data[video] };
                        $('#capture-video-clip').append('<video class="fullMovie" id="fullMovieClip" controls > <source src="' + scope.videos[video].uri + '" type="video/mp4" /></video>');
                    }
                }, 0)
            }

            // take video
            scope.captureVideo = function (videoClicked) {
                camera.captureVideo(videoClicked)
                .then(function (data) {
                    $timeout(function () {
                        scope.videos = camera.getVideos();
                        $('#capture-video-clip').append('<video class="fullMovie" id="fullMovieClip" controls poster="img/poster.png"> <source src="' + scope.videos['videoCenter'].uri + '" type="video/mp4" /></video>');
                        //var video = angular.element('<video class="fullMovie" id="fullMovieClip" controls> <source src="'+scope.videos['videoCenter'].uri+'" type="video/mp4" /></video>');
                        //el.children.append(video);
                        //scope.videos['videoCenter'].videoTag = ;
                        scope.videoClicked = videoClicked;
                        if (scope.videoSaved[scope.videoClicked] == true) {
                            scope.countVideos--;
                        }
                        scope.videoSaved[scope.videoClicked] = true;
                        scope.countVideos++;
                        if (scope.countVideos == scope.task.countVideo) {
                            //alert("סיימת את המשימה:)");
                            camera.uploadPhoto(scope.videos, "video", 1)
                            .then(function (data) {
                              //  result = {};
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
                });
            }

            // delete video
            scope.deleteVideo = function (videoClicked) {
                camera.deleteVideo(videoClicked);
                $timeout(function () {
                    scope.videos = camera.getVideos();
                    $('#fullMovieClip').remove();
                    scope.videoSaved[videoClicked] = false;
                    scope.countVideos--;
                }, 0);
            }
            /*var video = document.getElementById('fullMovieClip');
            video.addEventListener('click', function () {
            video.play();
            }, false);*/

            scope.$on('closeMission', function (event, data) {
                scope.endMission(scope.results);
            });

        },
        replace: true
    };


    //  הקוביה צריכה להיות לחיצה שפותחת את המצלמה וידאו
    //קליטת אישור בוידאו, 
    //מופיע מסך של נתינת שם לוידאו
    //אישור לשם של הוידאו והוא עובר למסך הראשי של הפיטצר
    //יש כפתור איקס למחיקת הוידאו ולצילום חוזר

    //לזהות שסיימו לצלם ומקפיץ פופאפ סיימתם וכפתור המשך...

    //כניסה אחרי מציגה את הוידאו?

} ]);