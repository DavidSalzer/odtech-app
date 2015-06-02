odtechApp.controller('mainNav', ['$rootScope', '$scope', '$state', 'missions', function ($rootScope, $scope, $state, missions) {
    $scope.tasks = [
    { type: "multiQuestion", id: "1" },
    { type: "navigation", id: "2" },
    { type: "openQuestion", id: "3" },
    { type: "takePhoto", id: "4" },
    { type: "takeVideo", id: "5" },
    { type: "watchVideo", id: "6" }
    ];

    missions.test();
    //missions.getMissions("690")
    //.then(function (data) {
    //    $scope.tasks = data;
    //    for (var i = 0; i < $scope.tasks.long; i++) {
    //        switch ($scope.tasks[i]["wpcf-type"][0]) {
    //            case "navigate":
    //                {

    //                    $scope.tasks[i].type = "navigation";
    //                    break;
    //                }
    //            case "take-photo":
    //                {

    //                    $scope.tasks[i].type = "takePhoto";
    //                    break;
    //                }
    //            case "capture-video":
    //                {

    //                    $scope.tasks[i].type = "takeVideo";
    //                    break;
    //                }
    //            case "watch-video":
    //                {

    //                    $scope.tasks[i].type = "watchVideo";
    //                    break;
    //                }
    //            case "quiz":
    //                {

    //                    $scope.tasks[i].type = "multiQuestion";
    //                    break;
    //                }
    //            case "write-text":
    //                {

    //                    $scope.tasks[i].type = "openQuestion";
    //                    break;
    //                }
    //        }
    //    }

    //});

    // console.log($scope.tasks);

    $scope.goToMission = function ($index) {
        //alert($scope.tasks[$index].id);
        $state.transitionTo('mission', { missionId: $scope.tasks[$index].id });
    }
    //
} ]);

