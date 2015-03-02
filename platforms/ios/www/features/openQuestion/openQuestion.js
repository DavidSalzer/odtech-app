odtechApp.directive('openQuestion', ['$timeout',function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: './features/openQuestion/openQuestion.html',
        link: function (scope, el, attrs) {
            //if the mission has been made
            scope.firstTime =true;
            if (scope.task.status == 'answer') {
              //  alert('This task has been made');
                // 
                   $timeout(function () {
                    scope.firstTime =false;
                }, 0)
            }

            scope.taskEnd = function () {
                //Perform end mission function. need validations
                scope.endMission(scope.ans); //the param is the answers of user
            }
        },
        replace: true
    };
} ]);