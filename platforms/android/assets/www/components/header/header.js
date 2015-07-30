odtechApp.controller('header', ['$scope', '$rootScope', '$state', 'server', '$timeout', function ($scope, $rootScope, $state, server, $timeout) {
    //set the state - for hide and show the footer
    //log out, it here temporarly
    $scope.$state = $state;

    $scope.logout = function () {
        $state.transitionTo('login');
        server.request({ "type": "appUserLogout", "req": {} })
        .then(function (data) {
            $rootScope.missionIdLastShown = 0;

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

    $scope.goToMaiNav = function () {
         console.log('mainNav 3')
        $state.transitionTo('mainNav');
       
    }
    $scope.pictures = {}
    $scope.takePhotoByMenu = function () {
        camera.captureImage(photoClicked)
                .then(function (data) {
                    $scope.pictures = camera.getPictures();
                    $scope.uploadImagesByMenu();
                    //$timeout(function () {
                    //    //get the pictures from camera service
                    //    scope.pictures = camera.getPictures();
                    //    scope.photoClicked = photoClicked;
                    //    scope.openImg = false;
                    //    scope.photoSaved[scope.photoClicked] = true;
                    //    //count the photos that took
                    //    scope.countPhotos++;
                    //    if (scope.countPhotos == scope.missionData.countPhoto || scope.missionData.countPhoto == undefined) {
                    //        //if the user take the last photo - display the "is finished question popup"

                    //        $timeout(function () {
                    //            scope.showFinishQuestion = true;
                    //        }, 0);
                    //    }
                    //}, 0);
                });
    }
    $scope.uploadImagesByMenu = function () {

        //if this is a application version
        if (isApp()) {
            camera.uploadPhoto($scope.pictures, "img", 1)
                            .then(function (data) {


                            });
        }
        //else -if this is a browser version
        //else {
        //    for (form in scope.pictures) {
        //        scope.pictures[form]['fd'] = new FormData(document.forms.namedItem(form));
        //    }
        //    camera.uploadPhotoFormData(scope.pictures, "img", scope.missionData.countPhoto)
        //            .then(function (data) {
        //               
        //            });

        //}
    }




} ]);

