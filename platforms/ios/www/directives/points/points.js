odtechApp.directive('points', ['$rootScope', 'server', function ($rootScope, server) {

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
            scope.setGlobalPoints = function () {
                request = {
                    type: "getUserPoints",
                    req: {

                    }
                }
                server.request(request)
                 .then(function (data) {
                    
                    scope.globalPoints = data.res.pointsOfUser;
                 })
                

            }

            $rootScope.$on('logout', function () {
                //init the global points on logout
                scope.globalPoints = 0;
            });


            scope.initPoints = function (tasks) {
              

            }
            //add the score when mission finished
            scope.$on('finishMission', function (event, data) {



                scope.setGlobalPoints();
            });
            //when there are tasks - init the score by server - on re-login etc.
            scope.$on('hasTasks', function (event, data) {
                scope.setGlobalPoints();
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