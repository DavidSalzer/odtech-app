odtechApp.directive('scala', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'E',
        templateUrl: './features/scala/scala.html',
        link: function (scope, el, attrs) {
            scope.missionData = scope.task;
            scope.results = {};
            scope.results.answer;
            scope.results.points = 0;
            scope.firstTime = true;
            //set the number of options display number in 'double' type
            scope.number = 10;
            scope.getNumber = function (num) {
                return new Array(num);
            }
            //set the num of range options - 9 for double answer or by options length
            scope.max = scope.missionData.options.length == 2 ? 9 : parseFloat(scope.missionData.options.length - 1);
            scope.ans = 0; //init the range value
            scope.isDisabled = false;

            //if the mission has been made
            if (scope.missionData.status == 'answer') {
                //hide the finish button
                scope.firstTime = false;
                //disable the range
                scope.isDisabled = "disabled";
                //set the range data
                scope.ans = scope.missionData.answer.data;


            }
            //set the height of range input by code - vertical input type range 
            scope.getHeight = function () {
                var height = 0;
                var right = 0;
                var top = 0;
                if ($(document).width() < "670") {
                    //  height = $("#main-container").height() * 0.58;
                    height = $(".range-wrap").height();

                    right = (height / 2.4) * -1;
                    top = height / 2;
                    //the width is height because of the rotate css
                    return "width:" + height + "px;right:" + right + "px;top:" + top + "px"
                }

            }

            /********************************************************************************/

            //init the first question

            scope.currentCorrectAnswer = scope.missionData.correct;
            scope.showAnswerIndication = false;
            scope.showAnswerRight = false;
            //set the correct answer text
            scope.rightAnswerTextIndex = scope.missionData.correct;
            scope.rightAnswerText = scope.missionData.options[scope.rightAnswerTextIndex];
            scope.results = {};
            scope.results.answer = [];
            scope.results.points = 0;
            scope.pointsPerQuestion = scope.missionData.points / 1;

            scope.answerClick = function () {
                //there is correct answer
                if (scope.currentCorrectAnswer != -1) {
                    //if the answer that clicked is correct
                    if (scope.ans == scope.currentCorrectAnswer) {
                        //show the right popup
                        scope.showAnswerIndication = true;
                        scope.showAnswerRight = true;

                        //save the data to the server
                        //Perform end mission function. need validations
                        scope.results.answer = scope.ans;
                        //get point, if the answer was sent in time
                        if (!scope.endTimer) {
                            //if this is 'correct answer type' -check the answer and the points
                            if (scope.missionData.correct != -1) {
                                if (scope.ans == scope.missionData.correct) {
                                    scope.results.points = scope.missionData.points;
                                }

                            }
                            //else - the user get all the points
                            else {
                                scope.results.points = scope.missionData.points;
                            }
                        }
                        //play the right sound
                        $rootScope.$broadcast('multiQuestionAnswerRight', {});

                    }
                    else {
                        //show the wrong popup
                        scope.showAnswerIndication = true;
                        scope.showAnswerRight = false;
                        //save the data to the server
                        scope.results.answer = scope.ans;

                        //play the wrong sound
                        $rootScope.$broadcast('multiQuestionAnswerWrong', {});

                    }


                    setTimeout(function () {
                        //round the results points 
                        scope.results.points = Math.round(scope.results.points);
                        //Perform end mission function.
                        scope.endMission(scope.results, scope.missionData); //the param is the answers of user

                    }, 1500);
                }
                else {
                    scope.results.points = scope.missionData.points;
                    //Perform end mission function.
                    scope.endMission(scope.results, scope.missionData); //the param is the answers of user
                }
            }

            scope.$on('closeMissionAndSendAnswer', function (event, data) {
                //round the results points 
                scope.results.points = Math.round(scope.results.points);
                scope.endMission(scope.results, scope.missionData);
            });


        },
        replace: true
    };
} ]);