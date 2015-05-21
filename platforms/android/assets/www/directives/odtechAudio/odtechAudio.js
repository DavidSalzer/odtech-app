odtechApp.directive('odtechAudio', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/odtechAudio/odtechAudio.html',
        link: function (scope, el, attrs) {
            scope.imgDomain = imgDomain;

            $timeout(function () {
                scope.sorce = imgDomain + attrs.audioSrc;

            }, 0);

            scope.load = function () {
                // $("audio").each(function () {
                $("#odtech-audio")[0].load();
                //   });
            }

            scope.play = function () {
                scope.pause();
                $("#odtech-audio")[0].play();
            }

            scope.pause = function () {
                $("audio").each(function () {
                    $(this)[0].pause();
                });
            }
            // scope.play();
            $timeout(function () {
                scope.load();
                scope.play();
            }, 1);

            //scope.$on('hideSplash', function () {
            //    scope.play();
            //});
        },
        replace: true
    };
} ]);