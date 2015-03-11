odtechApp.directive('openQuestion', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: './features/openQuestion/openQuestion.html',
        link: function (scope, el, attrs) {

            scope.results = {};

            //if the mission has been made
            scope.firstTime = true;
            if (scope.task.status == 'answer') {
                //  alert('This task has been made');
                // 
                $timeout(function () {
                    scope.firstTime = false;
                }, 0)
            }

            scope.taskEnd = function () {
                //Perform end mission function. need validations
                scope.results.answer = scope.ans;
                //get point, if the answer was sent in time
                if(!scope.endTimer){
                    scope.results.points = scope.task.points;
                }
                scope.endMission(scope.results); //the param is the answers of user
            }

            scope.$on('closeMission', function (event, data) {
                scope.endMission(scope.results);
            });
        },
        replace: true
    };
} ]);