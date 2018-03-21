odtechApp.directive('qrCode', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    //odtechApp.directive('qrCode', '$rootScope', '$timeout', [function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './features/qrCode/qrCode.html',
        link: function (scope, el, attrs) {
            scope.missionData = scope.task;
            scope.results = {};
            scope.results.answer = [];
            scope.results.points = 0;
            scope.showPlus = true;
            scope.showAnswerIndication = false;
            scope.firstTime = true;
            scope.secondTimeText = "";
            scope.lastTimeScaned = 0;
            scope.showTextData = false; ;
            scope.showDataPopup = false; ;
            if (scope.missionData.status == 'answer') {
                scope.firstTime = false;
                //set the second time text
                scope.secondTimeText = scope.missionData.answer && scope.missionData.answer.data == "scanned" ? 'הברקוד נסרק בהצלחה!' : 'המשימה בוצעה'
            }
            //scope.missionData.text = 'http://google.com'
            // scope.missionData.text = 'שלום, האם תרצו לקבל עוד מידע מעניין מאוד? לא כדאי לכם!'
            //if there is a data -link/text : its a data type, else - its a validation type
            if (scope.missionData.qrcode_text_or_link && scope.missionData.qrcode_text_or_link.length > 0) {
                scope.type = 'moreData'
            }
            else {
                scope.type = 'validation'
            }


            scope.setValidationBehavior = function (result) {
                scope.results.answer = result;
                scope.results.answer = 'scanned'
                //get point, if the answer was sent in time
                if (!scope.endTimer) {
                    scope.results.points = scope.missionData.points;
                }

                scope.endMission(scope.results, scope.missionData);



            }

            scope.setDataTypeBehavior = function (result) {
                //show the popup after validate - when data type
                scope.showDataPopup = true;
                  scope.showTextData = true;
               //  scope.showDataType = true;
                //if its link - open it with inappbrowser
                if (scope.missionData.qrcode_text_or_link && scope.missionData.qrcode_text_or_link.indexOf('http') == 0) {
                    window.open(scope.missionData.qrcode_text_or_link, '_blank')
                    scope.popupText = 'לחץ על הכפתור על מנת לעבור למשימה הבאה'
                }
                //else - display the text
                else {
                    scope.popupText = scope.missionData.qrcode_text_or_link;

                }
                scope.results.answer = 'scanned'
                //get point, if the answer was sent in time
                if (!scope.endTimer) {
                    scope.results.points = scope.missionData.points;
                }

                //  scope.endMission(scope.results, scope.missionData);
            }

            scope.taskEnd = function () {
                scope.results.answer = 'scanned'
                //get point, if the answer was sent in time
                if (!scope.endTimer) {
                    scope.results.points = scope.missionData.points;
                }

                scope.endMission(scope.results, scope.missionData);

            }

            scope.scancode = function () {


                //if the user click to scanbefore 2 seconds - scan again. else -ignore. 
                //to prevent scanner crash
                if (Date.now() - scope.lastTimeScaned > 2000) {
                    scope.lastTimeScaned = Date.now();
                    console.log('scan');
                    try {
                        //use barcodeScanner plugin and get the result scan
                        cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        scope.success = false;
                        //if this is the correct barcode - get the points and end mission

                        if (result.text.trim() == scope.missionData.qrCodeText.trim()) {
                            //if the mission  type is validation
                            if (scope.type == 'validation') {
                                scope.setValidationBehavior(result)

                            }

                            //else - if the type is 'moreData'
                            else {
                                scope.setDataTypeBehavior(result)


                            }
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
                    catch (e) {
                        var result = {}
                        result.text = '56253051'
                        if (result.text.trim() == scope.missionData.qrCodeText.trim()) {
                            //if the mission  type is validation
                            if (scope.type == 'validation') {
                                scope.setValidationBehavior(result)

                            }

                            //else - if the type is 'moreData'
                            else {
                                scope.setDataTypeBehavior(result)


                            }
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

                    }



                }


            }

            scope.$on('closeMissionAndSendAnswer', function (event, data) {
                scope.endMission(scope.results, scope.missionData);
            });
        },
        replace: true
    };
} ]);