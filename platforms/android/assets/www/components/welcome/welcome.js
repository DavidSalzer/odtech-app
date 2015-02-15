odtechApp.controller('welcome', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
    $scope.goToMission = function () {
        $state.transitionTo('mission', { missionId: 4 });
    }
} ]);