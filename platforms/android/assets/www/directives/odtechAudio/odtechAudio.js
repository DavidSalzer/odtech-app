odtechApp.directive('odtechAudio', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/odtechAudio/odtechAudio.html',
        link: function (scope, el, attrs) {

            scope.imgDomain = imgDomain;
            scope.isPlaying = false;
            scope.audioSrc = attrs.audioSrc;
            $rootScope.my_media = null;
            $timeout(function () {
                scope.sorce = imgDomain + scope.audioSrc;

            }, 0);

            scope.load = function () {
                // $("audio").each(function () {
                //  $("#odtech-audio")[0].load();
                //   });
            };



            scope.play = function () {
                if (scope.isPlaying){
                    scope.pause();
                }

                //  $("#odtech-audio")[0].play();

                try {
                    //if the media is null -init the element, else - play without init before
                    if ($rootScope.my_media == null) {
                        $rootScope.my_media = new Media(scope.sorce, 
                        function () {
                            console.log("playAudio():Audio Success");
                                },
                                // error callback
                        function (err) {
                                    console.log("playAudio():Audio Error: " + JSON.stringify(err));
                                });
                    }

                    // Play audio
                    $rootScope.my_media.play();
                    scope.isPlaying = true;
                }
                catch (e) { }
            };


            scope.pause = function () {
                //$("audio").each(function () {
                //    $(this)[0].pause();

                //});
                //$rootScope.my_media
                if ($rootScope.my_media) {
                    $rootScope.my_media.pause();
                    scope.isPlaying = false;

                }
            };


            if (scope.audioSrc && scope.audioSrc != "") {
                $timeout(function () {
                    scope.play();
                }, 1);
            }


            scope.togglePlay = function () {
                //  if the audio is playing - pause it
                if (scope.isPlaying) {
                    scope.pause();
                }
                else {
                    scope.play();
                }

                // $("#odtech-audio-silence")[0].play();
            };

            scope.mediaInit = function () {
               if($rootScope.my_media !=null){
                    $rootScope.my_media.release();
                }
            };

            //the events that cause the media stop
            scope.$on('startMission', function () {
                console.log('audio startMission');
                scope.mediaInit();

            });
            scope.$on('startDayClick', function () {
                console.log('audio startDayClick');
                scope.mediaInit();

            });
             scope.$on('hideDidYouKnow', function (event,audio) {
                  console.log('audio hideDidYouKnow');
                  scope.mediaInit();
            });

            scope.$on('stopMusic', function(){
                console.log('stop all playing music');
                if (scope.isPlaying){
                    scope.mediaInit();              
                }
            });
       
               
        },
        replace: true
    };
} ]);
