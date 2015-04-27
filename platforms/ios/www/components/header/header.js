odtechApp.controller('header', ['$scope', '$state', 'server', '$timeout', function ($scope, $state, server, $timeout) {
    //set the state - for hide and show the footer
    //log out, it here temporarly
    $scope.$state = $state;

    $scope.logout = function () {
        $state.transitionTo('login');
        server.request({ "type": "appUserLogout", "req": {} })
        .then(function (data) {

            //clear the pictures from camera array
            camera.setPicturesAndVideos({}, {});
        })
    }

    document.body.onclick = function () {
        $timeout(function () {
            $scope.showMenu = false;
        }, 0);
    }

    $scope.showMenuFunc = function (e) {
        $timeout(function () {
            $scope.showMenu = !$scope.showMenu;
        }, 0);
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    $scope.goToScorePage = function () {
        $state.transitionTo('groupsScore');
    }

    $scope.goToMaiNav=function(){
        $state.transitionTo('mainNav');
    }




} ]);

