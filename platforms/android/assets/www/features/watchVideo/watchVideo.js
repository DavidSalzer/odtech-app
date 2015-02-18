odtechApp.directive('watchVideo', [function () {
    return {
        restrict: 'E',
        templateUrl: './features/watchVideo/watchVideo.html',
        link: function (scope, el, attrs) {
            scope.scancode = function () {
                var scanner = cordova.require("com.phonegap.plugins.barcodescanner.barcodescanner");

                scanner.scan(
            function (result) {

                self.isNavOn = false;
                //navigationController.showMainMenu();
                alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
            },
            function (error) {
                //navigationController.showMainMenu();
                alert("Scanning failed: " + error);
            }
        );
            }
        },
        replace: true
    };
} ]);