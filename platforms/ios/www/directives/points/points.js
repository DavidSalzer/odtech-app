odtechApp.directive('points', ['$rootScope',function ($rootScope) {

    return {
        restrict: 'E',
        templateUrl: function (elem, attrs) {
            //set the template by the attr "type"
            if (attrs.type == "global") {
                return './directives/points/global-points.html'
            }
            else if (attrs.type == "single") {
                return './directives/points/single-points.html'
            }

        },
        link: function (scope, element, attrs) {
            scope.globalPoints = 0;
            scope.addToGlobalPoints = function (points) {
                if (points) {
                    scope.globalPoints = parseInt(scope.globalPoints) + parseInt(points);
                }

            }

            $rootScope.$on('logout', function () {
                //init the global points on logout
                scope.globalPoints = 0;
            });


            scope.initPoints = function (tasks) {
                //sum the points from tasks list
                scope.globalPoints = 0;
                for (var i = 0; i < tasks.length; i++) {
                    //if there is points - add it
                    if (tasks[i].answer && tasks[i].answer.points) {
                        scope.addToGlobalPoints(parseInt(tasks[i].answer.points));
                    }
                }

            }

            scope.$on('finishMission', function (event, data) {
                scope.addToGlobalPoints(data.results.points);
            });
            scope.$on('hasTasks', function (event, data) {
                scope.initPoints(data.tasks);
            });
        },

        replace: true
    }

    //מציג כמה נקודות יש עבור משימה בתאור ובהקדמה
    //במידה והצליחו את המשימה המשתמש מקבל את הנדוקות
    //מוצג לו מסך כל הכבוד הצלחת ומספר הנקודות
    //במידה ולא הצליח כותב לא נורא פעם הבאה
    //מופיע בפוטר מספר הנקודות הכולל

} ]);