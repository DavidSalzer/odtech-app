odtechApp.directive('didYouKnow', ['$state', '$rootScope', '$timeout', function ($state, $rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/didYouKnow/didYouKnow.html',
        link: function (scope, el, attrs) {
            scope.showDidYouKnow = false;
            scope.imgDomain = imgDomain;
            scope.didYouKnowText = "";
            $rootScope.missionIdLastShown = 0; // the mission id that the 'did you know' text was display. 
            scope.hideDidYouKnow = function () {
                //hide did you know
                scope.showDidYouKnow = false;
                $rootScope.$broadcast('hideDidYouKnow');
            }
            //the did you know have to display after the finish popup display and hide
            //or when click on the x button on finish popup
            scope.$on('finishMissionHide', function (event, data) {
                scope.toShowDidyouKnow(data.task);
            });
            scope.$on('closeMissionAnswered', function (event, data) {
                scope.toShowDidyouKnow(data.task);
            });
            scope.toShowDidyouKnow = function (task) {
                //if this is not a subMission
                if (scope.task && scope.task.isRouteMission == "0") {

                    //if there is didyouknow field
                    if (task.didYouKnow && task.didYouKnow != '') {
                        //if the did you know of this mission id wasn't shown -show it
                        if (task.mid != $rootScope.missionIdLastShown) {
                            $timeout(function () {
                                $rootScope.missionIdLastShown = task.mid;
                                scope.didYouKnowText = task.didYouKnow;
                                scope.didYouKnowImg = task.imgUrlDyk;
                                scope.audioUrl = task.audioUrl2;
                                scope.showDidYouKnow = true;

                            }, 0)
                        }

                    }
                }
                //if this is a subMission -close it
                else{
                 console.log('asf')   
                }

            }
            scope.openLargeImage = function () {
                $rootScope.$broadcast('openLargeImage');
            }
        },
        replace: true
    };


} ]);