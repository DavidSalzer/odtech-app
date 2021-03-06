odtechApp.directive('didYouKnow', ['$state', '$rootScope', '$timeout', 'missions', function ($state, $rootScope, $timeout, missions) {
    return {
        restrict: 'E',
        templateUrl: './directives/didYouKnow/didYouKnow.html',
        link: function (scope, el, attrs) {
            scope.showDidYouKnow = false;
            scope.imgDomain = imgDomain;
            scope.didYouKnowText = "";
            $rootScope.didyouKnowsArray = [];
            $rootScope.missionIdLastShown = 0; // the mission id that the 'did you know' text was display. 
          //  $rootScope.delayStartMissionAudio = true;

            scope.hideDidYouKnow = function () {
                //hide did you know
                scope.showDidYouKnow = false;
                $rootScope.$broadcast('hideDidYouKnow',{audio: scope.audioUrl});
                next = missions.directlyNext($rootScope.missionIdLastShown);
                if (next){
                    $state.transitionTo('mission', { missionId: next });
                } 
                //else if ($rootScope.isStationArch) {
                //    $state.transitionTo('mainNav', { stageId: $rootScope.currentStage });
                //} else {
                //    $state.transitionTo('mainNav');
                //}
            };
            //the did you know have to display after the finish popup display and hide
            //or when click on the x button on finish popup
            scope.$on('finishMissionHide', function (event, data) {
                scope.toShowDidyouKnow(data.data);
            });
            scope.$on('closeMissionAnswered', function (event, data) {
                console.log('closeMissionAnswered');
                scope.toShowDidyouKnow(data.task);
            });
            scope.$on('closeMissionAndSendAnswer', function (event, data) {
              scope.toShowDidyouKnow(data.data);
            });
            scope.toShowDidyouKnow = function (task) {
                //if there is didyouknow field and this did you know not showed
                if (task.didYouKnow && task.didYouKnow != '' && $rootScope.didyouKnowsArray['did' + task.mid] == undefined) {
                    //if the did you know of this mission id wasn't shown -show it
                    if (task.mid != $rootScope.missionIdLastShown) {
                        $timeout(function () {
                            $rootScope.didyouKnowsArray['did' + task.mid] = true;
                            $rootScope.missionIdLastShown = task.mid;
                            scope.didYouKnowText = task.didYouKnow;
                            scope.didYouKnowImg = task.imgUrlDyk;
                            scope.audioUrl = task.audioUrl2;
                            scope.showDidYouKnow = true;
                            // if (scope.audioUrl){
                            //     $rootScope.delayStartMissionAudio = true;
                            // }
                            // else {
                            //     $rootScope.delayStartMissionAudio = false;
                            // }
                        }, 0);
                    }

                }
            };
            scope.openLargeImage = function () {
                $rootScope.$broadcast('openLargeImage');
            };
        },
        replace: true
    };


} ]);