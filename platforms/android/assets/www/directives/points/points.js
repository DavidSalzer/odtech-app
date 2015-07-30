odtechApp.directive('points', ['$rootScope', function ($rootScope) {

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
            scope.introductionsPoints = 0;
            scope.globalPoints = 0;
            //sum the points
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
            //add the score when mission finished
            scope.$on('finishMission', function (event, data) {
                scope.addToGlobalPoints(data.results.points);
            });
            //when there are tasks - init the score by server - on re-login etc.
            scope.$on('hasTasks', function (event, data) {
                scope.initPoints(data.tasks);
            });

            ////listen to parent mission and only for him show the timer - freeze
            //scope.$watch('parentMissionData', function () {
            //   
            //});
            scope.$on('showIntroductionPage', function (event, data) {
                 if (attrs.type == "single") {
                    scope.introductionsPoints = data.data.points;
                }
            });

        },

        replace: true
    }


} ]);