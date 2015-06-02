odtechApp.directive('odtechAudio', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/odtechAudio/odtechAudio.html',
        link: function (scope, el, attrs) {
          
            scope.imgDomain = imgDomain;
            scope.isPlaying = false;
            scope.audioSrc = attrs.audioSrc;
            $timeout(function () {
                scope.sorce = imgDomain +scope.audioSrc;

            }, 0);

            scope.load = function () {
                // $("audio").each(function () {
                $("#odtech-audio")[0].load();
                //   });
            }

            scope.play = function () {
                scope.pause();
                $("#odtech-audio")[0].play();
                scope.isPlaying = true;
            }

            scope.pause = function () {
                $("audio").each(function () {
                    $(this)[0].pause();

                });
                scope.isPlaying = false
            }
            // scope.play();
            if (scope.audioSrc && scope.audioSrc != "") {
                $timeout(function () {
                    scope.load();
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
            }

            //scope.$on('hideSplash', function () {
            //    scope.play();
            //});
        },
        replace: true
    };
} ]);