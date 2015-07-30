odtechApp.directive('qrCode', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    //odtechApp.directive('qrCode', '$rootScope', '$timeout', [function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './features/qrCode/qrCode.html',
        link: function (scope, el, attrs) {
            scope.missionData = scope.task;
            scope.results = {};
            scope.results.answer;
            scope.results.points = 0;
            scope.showPlus = true;
            scope.showAnswerIndication = false;
            scope.firstTime = true;
            scope.secondTimeText = "";
            if (scope.missionData.status == 'answer') {
                scope.firstTime = false;
                //set the second time text
                scope.secondTimeText = scope.missionData.answer && scope.missionData.answer.data == "scanned" ? 'הברקוד נסרק בהצלחה!' : 'המשימה בוצעה'
            }


            scope.scancode = function () {

                //use barcodeScanner plugin and get the result scan
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        scope.success = false;
                        //alert("We got a barcode\n" +
                        //"Result: " + result.text + "\n" +
                        //"Format: " + result.format + "\n" +
                        //"Cancelled: " + result.cancelled);

                        //if this is the correct barcode - get the points and end mission
                        if (result.text.trim() == scope.missionData.qrCodeText.trim()) {
                            scope.results.answer = result;
                            scope.results.answer = 'scanned'
                            //get point, if the answer was sent in time
                            if (!scope.endTimer) {
                                scope.results.points = scope.missionData.points;
                            }

                            scope.endMission(scope.results,scope.missionData);
                        }
                        //else- show the fail popup
                        else {
                            scope.showAnswerIndication = true;
                            $rootScope.$broadcast('multiQuestionAnswerWrong', {});

                            //hide the wrong popup
                            $timeout(function () {
                                scope.showAnswerIndication = false;
                            }, 4000)
                        }



                    },
                    function (error) {
                        alert("Scanning failed: " + error);
                    }
                );
            }

            scope.$on('closeMissionAndSendAnswer', function (event, data) {
                scope.endMission(scope.results,scope.missionData);
            });
        },
        replace: true
    };
} ]);