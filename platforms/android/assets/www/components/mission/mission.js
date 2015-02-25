odtechApp.controller('mission', ['$rootScope', '$scope', '$state', '$stateParams', 'missions', '$timeout', function ($rootScope, $scope, $state, $stateParams, missions, $timeout) {

    //set mission from server
    missions.getMissionById($stateParams.missionId).then(function (data) {
        console.log(data);
        $scope.task = data.res;

    });

    //mission general parameters
    $scope.startMission = false;
    $scope.finishMission = false;
    $scope.successMission = false;
    $scope.popupShow = false;
    $scope.showDidYouKnow = false;
    $scope.results;
    //$scope.task = $scope.tasks[$stateParams.missionId];

    $scope.endMission = function (results) {
        if ($scope.task.didYouKnow && $scope.task.didYouKnow != '') {
            $timeout(function () {
                $scope.showDidYouKnow = true;
            }, 0)
        }
        else {
            if ($scope.task.next) {

            }
            else {
                $state.transitionTo('mainNav');
            }
        }
    }
} ]);
