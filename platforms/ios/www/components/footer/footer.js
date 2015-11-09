odtechApp.controller('footer', ['$rootScope', '$scope', '$state', 'server', '$timeout', 'camera', function ($rootScope, $scope, $state, server, $timeout, camera) {
    //set the state - for hide and show the footer

    $scope.$state = $state;
  
    $scope.backClick = function () {
        if ($state.is('mainNav')) {
            $state.transitionTo('stages');
        }
        else {

            history.back()
        }
    }
} ]);