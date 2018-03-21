odtechApp.directive('openQuestion', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: './features/openQuestion/openQuestion.html',
        link: function (scope, el, attrs) {

            scope.results = {};
            scope.results.answer =[];
            scope.results.points = 0;
            scope.missionData;
            scope.setData = function () {
                //set the  data for mission - parent or sub
                if ($rootScope.subMissionOpen != -1) {
                    scope.missionData = $rootScope.subMissionOpen;
                }
                else {
                    scope.missionData = scope.parentMissionData;
                }
                //if the mission has been made

                if (scope.missionData.status == 'answer') {
                    scope.hideIntroductionPage();

                    $timeout(function () {
                        scope.firstTime = false;
                    }, 0)
                }
                else {
                    scope.firstTime = true;
                }

            }
            scope.setData();

            scope.taskEnd = function () {
                //Perform end mission function. need validations
                scope.results.answer = scope.ans;
                //get point, if the answer was sent in time
                if (!scope.endTimer) {
                    //  var str = "The best things in life are free";
                    var patt = new RegExp(scope.missionData.regChecker,"i");
                    var res = patt.test(scope.results.answer);
                    if (res) {
                        scope.results.points = scope.missionData.points;
                    }
                    else {
                        scope.results.points = 0;
                    }

                }
                console.log('on scope.taskEnd open question: mid: ' + scope.missionData.mid)
                //Perform end mission function.
                scope.endMission(scope.results, scope.missionData); //the param is the answers of user

            }

            scope.$on('closeMissionAndSendAnswer', function (event, data) {
                //send answer to server if the current if this is the mission that close
                if (scope.missionData.status == "notAnswer" && scope.missionData.mid == data.data.mid) {
                    scope.endMission(scope.results, scope.missionData);
                }

            });


            /*submission data*/
            //addon for submission because the controller is alive
            scope.$on('subMissionDataGet', function (event, data) {
                if (data.data.type == "openQuestion" && data.data.mid == $rootScope.subMissionOpen.mid) {
                    scope.setData()
                }
            });

        },
        replace: true
    };
} ]);