odtechApp.controller('mainNav', ['$scope', '$state', 'missions', '$timeout', function ($scope, $state, missions, $timeout) {

    $scope.currentMission = 0;
    $scope.isDescription = true;

    $scope.description = 'תיאור יום הפעילות'; //need to get from server

    $scope.closeDescription = function () {
        $timeout(function () {
            $scope.isDescription = false;
        }, 0)
    }

    //set missions from server
    missions.getMissions().then(function (data) {
        console.log(data);
        $scope.tasks = data.res;
    });

    //go to mission
    $scope.goToMission = function ($index) {
        $state.transitionTo('mission', { missionId: $scope.tasks[$index].mid });
    }


    //
    //האם המסלול לינארי או לא.
    //האם שמים מנעול עבור כל משימה או שזה לא לינארי

    //מה הסטטוס של כל משימה
    //האם התבצעה או לא וכך להראות מנעול או כבר בוצע...



} ]);

