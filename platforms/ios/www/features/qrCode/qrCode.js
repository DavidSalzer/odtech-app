odtechApp.directive('qrCode', [function () {
    return {
        restrict: 'E',
        templateUrl: './features/qrCode/qrCode.html',
        link: function (scope, el, attrs) {
            scope.scancode = function () {

                //use barcodeScanner plugin and get the result scan
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        success = true;
                        alert("We got a barcode\n" +
                        "Result: " + result.text + "\n" +
                        "Format: " + result.format + "\n" +
                        "Cancelled: " + result.cancelled);
                    },
                    function (error) {
                        alert("Scanning failed: " + error);
                    }
                );
            }
        },
        replace: true
    };
} ]);