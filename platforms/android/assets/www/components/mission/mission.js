odtechApp.controller('mission', ['$rootScope', '$scope', '$state', '$stateParams', 'missions', function ($rootScope, $scope, $state, $stateParams, missions) {

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
    //$scope.task = $scope.tasks[$stateParams.missionId];

} ]);
