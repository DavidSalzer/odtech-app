odtechApp.controller('mission', ['$rootScope', '$scope', '$state', '$stateParams', function ($rootScope, $scope, $state, $stateParams) {
    $scope.tasks = {
        "1": { type: "multiQuestion", id: "1" },
        "2": { type: "navigation", id: "2" },
        "3": { type: "openQuestion", id: "3" },
        "4": { type: "takePhoto", id: "4" },
        "5": { type: "takeVideo", id: "5" },
        "6": { type: "watchVideo", id: "6" }
    };

    $scope.startMission = false;
    $scope.popupShow = false;
    $scope.task = $scope.tasks[$stateParams.missionId];
} ]);