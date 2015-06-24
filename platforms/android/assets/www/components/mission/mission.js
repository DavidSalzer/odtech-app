odtechApp.controller('mission', ['$rootScope', '$scope', '$state', '$stateParams', 'missions', '$timeout', 'server', function ($rootScope, $scope, $state, $stateParams, missions, $timeout, server) {

    //mission general parameters
    $scope.startMission = false;
    $scope.finishMission = false;
    $scope.successMission = false;
    $scope.popupShow = false;
    //$scope.showDidYouKnow = true;
    //$scope.showDidYouKnow = false;
    $scope.results;
    //  $rootScope.blurAll = false;
    //set mission from server
    missions.getMissionById($stateParams.missionId).then(function (data) {
        console.log(data);
        //if there is error
        if (data.res.error) {
            //if this mission is not in my activity day
            if (data.res.error == "non permission") {
                $state.transitionTo('mainNav');
            }
        }
        //there is data
        else {
            $scope.task = data.res;
            //if the mission has been made
            if ($scope.task.status == 'answer') {
                $scope.popupShow = false;
                $scope.missionAnswered = true;
                $scope.startMission = true;

            }
        }

    });

    //this function is performed in the end of mission. 
    $scope.endMission = function (results) {
        request = {
            type: "sendAnswer",
            req: {
                data: results,
                mid: $stateParams.missionId
            }
        }

        server.request(request)
        .then(function (data) {
            $scope.task.status = 'answer';
            $timeout(function () {
                $scope.missionAnswered = true;
            }, 0)
        })
        //if the timer NOT ended
        //set data and display popup finish mission
        if (!$scope.endTimer) {
            $scope.successMission = true;
            $scope.finishMission = true;

            //mission finished - throw broadcast
            $rootScope.$broadcast('finishMission', { results: results, timeOver: false });

            //TODO:  להוציא את החלק הזה ל missionFinish
            if (results.points > 0) {
                $scope.finishMissionTitle = 'כל הכבוד!';
                $scope.finishMissionL1 = 'ביצעתם את המשימה בהצלחה';
                $scope.finishMissionL2 = 'וצברתם ' + results.points + ' נקודות.';
            }
            else {
                $scope.finishMissionTitle = 'כל הכבוד!';
                $scope.finishMissionL1 = '';
                $scope.finishMissionL2 = 'קיבלתם 0 נקודות';
            }

            $scope.recievedpoints = results.points;

        }
        //if finish after time is over
        else {
            $scope.successMission = true;
            $scope.finishMission = true;

            //mission finished - throw broadcast
            $rootScope.$broadcast('finishMission', { results: results, timeOver: true });

            $scope.finishMissionTitle = 'כל הכבוד!';
            $scope.finishMissionL1 = '';
            $scope.finishMissionL2 = 'קיבלתם 0 נקודות';

            $scope.recievedpoints = 0;
        }

        $scope.finishTimeout = $timeout(function () {
            $scope.finishMission = false;
            //if this is not a subMission
            if ($scope.task && $scope.task.isRouteMission == "0") {
                $rootScope.$broadcast('finishMissionHide', { task: $scope.task });

                //if need to go to next mission automatically.
                $scope.next = missions.directlyNext($scope.task.mid);
                if ($scope.next) {
                    $state.transitionTo('mission', { missionId: $scope.next });
                }
                else {
                    $state.transitionTo('mainNav');
                }

            }
            //if its a subMission
            else {
               //call the parent scope (navigation mission) and close the subMission
                $timeout(function () {
                    parent.angular.element('#subMissionFrame').scope().closeSubMission()
                }, 0)

            }

            //}

        }, 7000)


    }
    //if the timer ended
    $scope.$on('endTimer', function (event, data) {
        $timeout(function () {
            $scope.endTimer = true;
            $scope.missionAnswered = true;
            if ($scope.task.status != 'answer') {
                $scope.finishMission = true;
                $scope.finishMissionTitle = 'נגמר הזמן.';
                $scope.finishMissionL1 = 'הזמן שנותר לביצוע המשימה תם.';
                $scope.finishMissionL2 = 'נסו שוב במשימה הבאה...';

                //play the wrong sound
                $rootScope.$broadcast('endMissionTimer', {});
            }
        }, 0)
        $timeout(function () {
            $scope.finishMission = false;
        }, 4000)
    });

    //user can close inactive mission
    $scope.closeMission = function () {

        ////if the sub mission open (in navigate) - close subMission
        if ($scope.task.isRouteMission != "0") {
            $rootScope.$broadcast('closeSubMission', { task: $scope.task });
        }
        else {
            if ($scope.task.status != 'answer') {
                $rootScope.$broadcast('closeMission', {});
            }
            //if the mission answered
            else {
                $rootScope.$broadcast('closeMissionAnswered', { task: $scope.task });
            }
            $state.transitionTo('mainNav');
        }

    }

    //cancel the timer of finish popup on getout from this page
    $scope.$on('$destroy', function () {
        $timeout.cancel($scope.finishTimeout);
    });
} ]);
