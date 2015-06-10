odtechApp.directive('qrCode', [function () {
    return {
        restrict: 'E',
        templateUrl: './features/qrCode/qrCode.html',
        link: function (scope, el, attrs) {
            scope.results = {};
            scope.results.answer ;
            scope.results.points = 0;

            scope.scancode = function () {

                //use barcodeScanner plugin and get the result scan
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        success = true;
                        alert("We got a barcode\n" +
                        "Result: " + result.text + "\n" +
                        "Format: " + result.format + "\n" +
                        "Cancelled: " + result.cancelled);
                        scope.results.answer = result;

                        //get point, if the answer was sent in time
                        if (!scope.endTimer) {
                            scope.results.points = scope.task.points;
                        }

                        scope.endMission(scope.results);
                    },
                    function (error) {
                        alert("Scanning failed: " + error);
                    }
                );
            }

            scope.$on('closeMission', function (event, data) {
                scope.endMission(scope.results);
            });
        },
        replace: true
    };
} ]);