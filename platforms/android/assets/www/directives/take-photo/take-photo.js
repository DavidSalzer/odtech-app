odtechApp.directive('take-photo', 'camera', [function (camera) {
    return {
        restrict: 'E',
        templateUrl: './directives/take-photo/take-photo.html',
        link: function (scope, el, attrs) {
            el.on('click', function () {
                camera.captureImage();
            });
        },
        replace: true
    };

    //נכנסנים למשימת צילום תמונה
    //
} ]);