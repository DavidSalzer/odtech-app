odtechApp.controller('mainNav', ['$rootScope', '$scope', '$state', 'missions', '$timeout', 'server', function ($rootScope, $scope, $state, missions, $timeout, server) {

    $scope.currentMission = 0;
    //$scope.isDescription = true;

    //$scope.description = 'תיאור יום הפעילות'; //need to get from server

    $scope.closeDescription = function () {
        $timeout(function () {
            $rootScope.showDescription = false;
        }, 0)
    }

    //set missions from server
    missions.getMissions().then(function (data) {
        //if success.
        if (data.res.activitie && data.res.activitie.mission) {
            $scope.tasks = data.res.activitie.mission;
            $scope.description = data.res.activitie.description;
        }
    });

    //go to mission
    $scope.goToMission = function ($index) {
        $state.transitionTo('mission', { missionId: $scope.tasks[$index].mid });
    }

    //log out, it here temporarly
    $scope.logout = function () {
        server.request({ "type": "appUserLogout", "req": {} })
        .then(function (data) {
            $state.transitionTo('login');
        })
    }


    //
    //האם המסלול לינארי או לא.
    //האם שמים מנעול עבור כל משימה או שזה לא לינארי

    //מה הסטטוס של כל משימה
    //האם התבצעה או לא וכך להראות מנעול או כבר בוצע...



} ]);

