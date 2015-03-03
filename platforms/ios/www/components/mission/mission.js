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
        })

        //if the mission has did you know.
        if ($scope.task.didYouKnow && $scope.task.didYouKnow != '') {
            $timeout(function () {
                //$scope.showDidYouKnow = true;
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
    }

    $scope.$on('endTimer', function (event, data) {
        $timeout(function () {
            $scope.endTimer = true;
        }, 0)
    });

    //user can close inactive mission
    $scope.closeMission = function () {
        $state.transitionTo('mainNav');
    }
} ]);
