odtechApp.controller('mission', ['$rootScope', '$scope', '$state', '$stateParams', 'missions', '$timeout', 'server', function ($rootScope, $scope, $state, $stateParams, missions, $timeout, server) {

    //set mission from server
    missions.getMissionById($stateParams.missionId).then(function (data) {
        console.log(data);
        $scope.task = data.res;
        //if the mission has been made
        if ($scope.task.status == 'answer') {
            $scope.missionAnswered = true;
            $scope.startMission = true;
            $scope.popupShow = false;
        }

    });

    //mission general parameters
    $scope.startMission = false;
    $scope.finishMission = false;
    $scope.successMission = false;
    $scope.popupShow = false;
    $scope.showDidYouKnow = false;
    $scope.results;
    //$scope.task = $scope.tasks[$stateParams.missionId];

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

        //set data and display popup finish mission
        if (!$scope.endTimer) {
            $scope.successMission = true;
            $scope.finishMission = true;
            $scope.finishMissionTitle = 'כל הכבוד!';
            $scope.finishMissionL1 = 'ביצעתם את המשימה בהצלחה';
            $scope.finishMissionL2 = 'וצברתם ' + results.points + ' נקודות.';
            $scope.recievedpoints = results.points;
        }

        $timeout(function () {
            $scope.finishMission = false;

            //if the mission has did you know.
            if ($scope.task.didYouKnow && $scope.task.didYouKnow != '') {
                $timeout(function () {
                    $scope.showDidYouKnow = true;
                }, 0)
            }
            else {
                //if need to go to next mission automatically.
                if ($scope.task.next) {

                }
                else {
                    $state.transitionTo('mainNav');
                }
            }

        }, 4000)


    }

    $scope.$on('endTimer', function (event, data) {
        $timeout(function () {
            $scope.endTimer = true;
            $scope.finishMission = true;
            $scope.finishMissionTitle = 'נגמר הזמן.';
            $scope.finishMissionL1 = 'הזמן שנותר לביצוע המשימה תם.';
            $scope.finishMissionL2 = 'נסו שוב במשימה הבאה...';
        }, 0)
        $timeout(function () {
            $scope.finishMission = false;
        }, 4000)
    });

    //user can close inactive mission
    $scope.closeMission = function () {
        if ($scope.task.status != 'answer') {
            $rootScope.$broadcast('closeMission', {});
        }
        $state.transitionTo('mainNav');
    }
} ]);
