odtechApp.directive('appRingtone', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/appRingtone/appRingtone.html',
        link: function (scope, el, attrs) {
            scope.imgDomain = imgDomain;
            $timeout(function () {
                scope.sorce = imgDomain;

            }, 0);
            //load all ringtones of app
            //scope.load = function () {
            //    $("audio").each(function () {
            //        $(this)[0].load();
            //    });
            //}
            //scope.load();

            //multi Question Answer Right
            scope.$on('multiQuestionAnswerRight', function () {
                $("#success")[0].load();
                $("#success")[0].play();
            });

            //multi Question Answer Wrong
            scope.$on('multiQuestionAnswerWrong', function () {
                $("#failBuzzer")[0].load();
                $("#failBuzzer")[0].play();
            });

            //end Mission Timer
            scope.$on('endMissionTimer', function () {
             $("#applause")[0].load();
                $("#applause")[0].play();
            });

            //finish Mission
            scope.$on('finishMission', function (event, data) {
                $("#applause")[0].load();
                $("#applause")[0].play();
            });

            //reached The Destination
            scope.$on('reachedTheDestination', function () {
                $("#success")[0].load();
                $("#success")[0].play();
            });
           

             $timeout(function () {
                scope.sorcetimeOver = imgDomain +'upload/misc258.mp3';
                scope.sorceapplause = imgDomain +'upload/applause-1.mp3';
                scope.sorcefailBuzzer = imgDomain +'upload/fail-buzzer.mp3';
                scope.sorcesuccess = imgDomain +'upload/ magic-chime.mp3';
                
                

            }, 0);

        },
        replace: true
    };
} ]);