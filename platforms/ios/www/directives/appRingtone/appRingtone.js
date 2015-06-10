odtechApp.directive('appRingtone', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'E',
        templateUrl: './directives/appRingtone/appRingtone.html',
        link: function (scope, el, attrs) {            
            //load all ringtones of app
            scope.load = function () {
                $(".audio audio").each(function () {
                    $(this)[0].load();
                });
            }
            scope.load();

            //multi Question Answer Right
            scope.$on('multiQuestionAnswerRight', function () {
                $("#success")[0].play();
            });

            //multi Question Answer Wrong
            scope.$on('multiQuestionAnswerWrong', function () {
                $("#failBuzzer")[0].play();
            });

            //end Mission Timer
            scope.$on('endMissionTimer', function () {
                $("#timeOver")[0].play();
            });

            //finish Mission
            scope.$on('finishMission', function (event, data) {
                $("#applause")[0].play();
            });

            //reached The Destination
             scope.$on('reachedTheDestination', function () {
                $("#success")[0].play();
            });
        },
        replace: true
    };
} ]);