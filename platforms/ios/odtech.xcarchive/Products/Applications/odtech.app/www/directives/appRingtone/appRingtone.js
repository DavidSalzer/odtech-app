odtechApp.directive('appRingtone', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/appRingtone/appRingtone.html',
        link: function (scope, el, attrs) {
            //   $rootScope.my_media = null;
            scope.imgDomain = imgDomain;
            $rootScope.mediaToPlay = null;
            $timeout(function () {
                scope.sorce = imgDomain;

            }, 0);
            $timeout(function () {
                scope.sorceapplause = imgDomain + 'upload/tada.mp3';
                console.log(scope.sorceapplause);
                scope.sorcetimeOver = imgDomain + 'upload/misc258.mp3';

              //  if (!isUsingDefaultSounds){
                    console.log('GETTING DEFAULT SOUNDS');
                    scope.sorcefailBuzzer = 'http://adminqa.odtech.co.il/upload/fail-buzzer-orpan.mp3'; //imgDomain + 'upload/fail-buzzer.mp3';
                    scope.sorcesuccess = 'http://adminqa.odtech.co.il/upload/magic-chime-orpan.mp3';//imgDomain + 'upload/magic-chime.mp3';
                // }
                // else {
                //     console.log('GETTING CUSTOME SOUNDS');
                //     scope.sorcefailBuzzer = imgDomain + 'upload/fail-buzzer-orpan.mp3';
                //     scope.sorcesuccess = imgDomain + 'upload/magic-chime-orpan.mp3';
                // }
                // console.log($rootScope.failBuzzerMedia);
                // console.log($rootScope.sorcesuccess);
             }, 0);
            try {

                $rootScope.successMedia = $rootScope.successMedia == undefined ? new Media(scope.sorcesuccess, scope.success, scope.error) : $rootScope.successMedia;
                $rootScope.failBuzzerMedia = $rootScope.failBuzzerMedia == undefined ? new Media(scope.sorcefailBuzzer, scope.success, scope.error) : $rootScope.failBuzzerMedia;
                $rootScope.timeoverMedia = $rootScope.timeoverMedia == undefined ? new Media(scope.sorcetimeOver, scope.success, scope.error) : $rootScope.timeoverMedia;
                $rootScope.applauseMedia = $rootScope.applauseMedia == undefined ? new Media(scope.sorceapplause, scope.success, scope.error) : $rootScope.applauseMedia;
                $rootScope.applauseMedia = new Media(scope.sorceapplause, scope.success, scope.error);

                console.log($rootScope.failBuzzerMedia);
                console.log($rootScope.sorcesuccess);
            }

            catch(e){}
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
                var src = "";

                //set the src file audio by type
                switch (type) {
                    case "success":
                        // src = scope.sorcesuccess;
                        $rootScope.mediaToPlay = $rootScope.successMedia;
                        break;
                    case "timeover":
                        // src = scope.sorcetimeOver;
                        $rootScope.mediaToPlay = $rootScope.timeoverMedia;
                        break;
                    case "applause":
                        // src = scope.sorceapplause;
                        $rootScope.mediaToPlay = $rootScope.applauseMedia;
                        break;
                    case "failBuzzer":
                        // src = scope.sorcefailBuzzer;
                        $rootScope.mediaToPlay = $rootScope.failBuzzerMedia;
                        break;
                }


                try {
                    //if the media is null -init the element, else - play without init before
                    //  if ($rootScope.my_media == null) {
                    // $rootScope.my_media = new Media(src, scope.success, scope.error)
                    //  }

                    // Play audio
                    //$rootScope.my_media.play();
                    $rootScope.mediaToPlay.play();
                }
                catch (e) { }
            };
            scope.success = function () {
                console.log("playAudio():Audio Success");
            };
            scope.error = function (error) {
                console.log("playAudio():Error!!" + error);
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