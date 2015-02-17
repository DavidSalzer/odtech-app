odtechApp.controller('mission', ['$rootScope', '$scope', '$state', '$stateParams', 'missions', function ($rootScope, $scope, $state, $stateParams, missions) {

    //set mission from server
    missions.getMissionById($stateParams.missionId).then(function (data) {
        console.log(data);
        $scope.task = data.res;
        
    });

    $scope.startMission = false;
   
    $scope.popupShow = false;
    //$scope.task = $scope.tasks[$stateParams.missionId];

} ]);
