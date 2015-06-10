odtechApp.directive('didYouKnow', ['$state', '$rootScope', '$timeout', function ($state, $rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/didYouKnow/didYouKnow.html',
        link: function (scope, el, attrs) {
            scope.showDidYouKnow = false;
            scope.didYouKnowText = "";
            scope.missionIdLastShown = 0; // the mission id that the 'did you know' text was display. 
            scope.hideDidYouKnow = function () {
                //hide did you know
                scope.showDidYouKnow = false;
               
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
                //if there is didyouknow field
                if (task.didYouKnow && task.didYouKnow != '') {
                    //if the did you know of this mission id wasn't shown -show it
                    if (task.mid != scope.missionIdLastShown) {
                        $timeout(function () {
                            scope.missionIdLastShown = task.mid;
                            scope.didYouKnowText = task.didYouKnow;
                            scope.showDidYouKnow = true;

                        }, 0)
                    }

                }
            }
        },
        replace: true
    };


} ]);