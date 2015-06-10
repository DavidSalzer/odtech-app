odtechApp.controller('header', ['$scope','$rootScope', '$state', 'server', '$timeout', function ($scope,$rootScope, $state, server, $timeout) {
    //set the state - for hide and show the footer
    //log out, it here temporarly
    $scope.$state = $state;

    $scope.logout = function () {
        $state.transitionTo('login');
        server.request({ "type": "appUserLogout", "req": {} })
        .then(function (data) {
            $rootScope.missionIdLastShown = 0; 
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
     //     $("#odtech-audio-silence")[0].play();
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

