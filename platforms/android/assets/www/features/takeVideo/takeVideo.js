odtechApp.directive('takeVideo', ['camera','$timeout', function (camera,$timeout) {
    return {
        restrict: 'E',
        templateUrl: './features/takeVideo/takeVideo.html',
        link: function (scope, el, attrs) {           
        scope.videoSaved = {};
            scope.pictures = {};
            scope.videoCenter = 'videoCenter';
            scope.videoUp = 'videoUp';
            scope.videoDown = 'videoDown';
            scope.videoLeft = 'videoLeft';
            scope.videoRight = 'videoRight';
            scope.countVideos = 0;
            scope.captureVideo = function (videoClicked) { // take video

                camera.captureVideo(videoClicked)
                .then(function (data) {
                    $timeout(function () {
                        scope.videos = camera.getVideos();
                        scope.videoClicked = videoClicked; //camera.getvideoClicked();
                        //scope.openVideo = true;
                        if(scope.videoSaved[scope.videoClicked] == true){
                            scope.countVideos--;
                        }
                        scope.videoSaved[scope.videoClicked] = true;
                        scope.countVideos++;
                        //if (scope.countVideos == scope.task.countVideo) {
                            alert("סיימת את המשימה:)");
                       //}
                    }, 0);
                });
            }

            scope.deleteVideo = function (videoClicked) { // delete video 
                camera.deleteVideo(videoClicked);
                $timeout(function () {
                    scope.videos = camera.getVideos();
                    scope.videoSaved[videoClicked] = false;
                    scope.countVideos--;
                }, 0);
            }
            var video = document.getElementById('fullMovieClip');
            video.addEventListener('click',function(){
              video.play();
            },false);
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