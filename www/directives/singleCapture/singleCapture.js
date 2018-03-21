odtechApp.directive('singleCapture', ['$state', 'server', 'camera', '$rootScope', '$timeout', function ($state, server, camera, $rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/singleCapture/singleCapture.html',
        link: function (scope, el, attrs) {


            scope.pictures = {}
            //capture the images
            scope.takePhotoByMenu = function () {
                camera.captureImage('photoCenter')
                .then(function (data) {
                    scope.pictures = camera.getPictures();
                    scope.uploadImagesByMenu();
                });
            }
            //upload the images
            scope.uploadImagesByMenu = function () {

                //if this is a application version
                // if (isApp()) {
                // if()
                camera.uploadPhoto(scope.pictures, "img", 1, attrs.type)
                            .then(function (data) {
                                //success to upload img
                                var x;
                            });

                //   }

            }
        },
        replace: true
    };

} ]);