odtechApp.directive('appRingtone', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/appRingtone/appRingtone.html',
        link: function (scope, el, attrs) {
            // $rootScope.my_media = null;
            scope.imgDomain = imgDomain;
            $rootScope.mediaToPlay = null;
            $timeout(function () {
                scope.sorce = imgDomain;

            }, 0);
            $timeout(function () {
                scope.sorceapplause = imgDomain + 'upload/tada.mp3';
                scope.sorcetimeOver = imgDomain + 'upload/misc258.mp3';

                if (!isUsingDefaultSounds){
                    console.log('GETTING DEFAULT SOUNDS');
                    scope.sorcefailBuzzer = imgDomain + 'upload/fail-buzzer.mp3';
                    scope.sorcesuccess = imgDomain + 'upload/magic-chime.mp3';
                }
                else {
                    console.log('GETTING CUSTOME SOUNDS');
                    scope.sorcefailBuzzer = imgDomain + 'upload/fail-buzzer-orpan.mp3';
                    scope.sorcesuccess = imgDomain + 'upload/magic-chime-orpan.mp3';
                }
             }, 0);

            //multi Question Answer Right
            scope.$on('multiQuestionAnswerRight', function () {
                scope.play("success");
            });

            //multi Question Answer Wrong
            scope.$on('multiQuestionAnswerWrong', function () {
                scope.play("failBuzzer");
            });

            //end Mission Timer
            scope.$on('endMissionTimer', function () {
                scope.play("timeover");
            });

            //finish Mission
            scope.$on('finishMission', function (event, data) {
                //if the mission finished and the time not overed
                //and the user get points
                if (data.timeOver == false && data.results.points > 0) {
                    scope.play("applause");
                }

            });

            //reached The Destination
            scope.$on('reachedTheDestination', function () {
                scope.play("success");
            });




            scope.play = function (type) {
                var src = '';
                //set the src file audio by type
                switch (type) {
                    case "success":
                         src = scope.sorcesuccess;
                        //$rootScope.mediaToPlay = $rootScope.successMedia;
                        console.log('success ' + src);
                        break;
                    case "timeover":
                         src = scope.sorcetimeOver;
                        //$rootScope.mediaToPlay = $rootScope.timeoverMedia;
                        break;
                    case "applause":
                         src = scope.sorceapplause;
                        //$rootScope.mediaToPlay = $rootScope.applauseMedia;
                        break;
                    case "failBuzzer":
                         src = scope.sorcefailBuzzer;
                        //$rootScope.mediaToPlay = $rootScope.failBuzzerMedia;
                        console.log('fail ' + src);
                        break;
                        
                }
                try {
                    //if the media is null -init the element, else - play without init before
                     if ($rootScope.mediaToPlay == null) {
                             $rootScope.mediaToPlay = new Media(src, scope.success, scope.error)
                     }

                    // Play audio
                    
                    $rootScope.mediaToPlay.stop();
                    $rootScope.mediaToPlay.play(src);
                    $rootScope.mediaInit();
                }
                catch (e) { }
            };
            scope.success = function (success) {
                console.log("playAudio():Audio Success");
            };
            scope.error = function (error) {
                     console.log("playAudio():Error!!" + error.code + error.message);
             };
            scope.mediaInit = function () {
                if ($rootScope.mediaToPlay != null) {
                    $rootScope.mediaToPlay.release();
                }

            };

            //the events that cause the media audio stop
            scope.$on('closeMissionAndSendAnswer ', function () {
                scope.mediaInit();

            });


        },
        replace: true
    };
} ]);