odtechApp.controller('mainNav', ['$rootScope', '$scope', '$state', 'missions', function ($rootScope, $scope, $state, missions) {
    $scope.tasks = [
    { type: "multiQuestion", id: "1" },
    { type: "navigation", id: "2" },
    { type: "openQuestion", id: "3" },
    { type: "takePhoto", id: "4" },
    { type: "takeVideo", id: "5" },
    { type: "watchVideo", id: "6" }
    ];

    missions.getMissions().then(function (data) {
        console.log(data);
        $scope.tasks = data.res;
    });

   
    $scope.goToMission = function ($index) {
        //alert($scope.tasks[$index].id);
        $state.transitionTo('mission', { missionId: $scope.tasks[$index].id });
    }
    //
} ]);

