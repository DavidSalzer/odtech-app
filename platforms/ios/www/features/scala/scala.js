odtechApp.directive('scala', [function () {
    return {
        restrict: 'E',
        templateUrl: './features/scala/scala.html',
        link: function (scope, el, attrs) {
            scope.results = {};
            scope.results.answer;
            scope.results.points = 0;
            scope.firstTime = true;
            //set the number of options display number in 'double' type
            scope.number = 10;
            scope.getNumber = function (num) {
                return new Array(num);
            }
            //set the num of range options
            scope.max = scope.task.options.length == 2 ? 9 : parseFloat(scope.task.options.length - 1);
            scope.ans = 0; //init the range value
            scope.isDisabled = false;

            //if the mission has been made
            if (scope.task.status == 'answer') {
                //hide the finish button
                scope.firstTime = false;
                //disable the range
                scope.isDisabled = "disabled";
                //set the range data
                scope.ans = scope.task.answer.data;


            }

            scope.getHeight = function () {
                var height = 0;
                var right = 0;
                var top = 0;
                if ($(document).width() < "670") {
                    height = $("#main-container").height() * 0.75;
                    right = (height / 2.4) * -1;
                    top = height / 2;
                    //return height + 'px';
                    return "width:" + height + "px;right:" + right + "px;top:" + top + "px"
                }

            }

            //scope.taskEnd = function () {
            //    //Perform end mission function. need validations
            //    scope.results.answer = scope.ans;

            //    //get point, if the answer was sent in time
            //    if (!scope.endTimer) {
            //        //if this is 'correct answer type' -check the answer and the points
            //        if (scope.task.correct != -1) {
            //            if (scope.ans == scope.task.correct) {
            //                scope.results.points = scope.task.points;
            //            }

            //        }
            //        //else - the user get all the points
            //        else {
            //            scope.results.points = scope.task.points;
            //        }


            //    }
            //    scope.endMission(scope.results); //the param is the answers of user
            //}


            //scope.$on('closeMission', function (event, data) {
            //    scope.endMission(scope.results);
            //});



            /********************************************************************************/

            //init the first question

            scope.currentCorrectAnswer = scope.task.correct;
            scope.showAnswerIndication = false;
            scope.showAnswerRight = false;
            //set the correct answer text
            scope.rightAnswerTextIndex = scope.task.correct;
            scope.rightAnswerText = scope.task.options[scope.rightAnswerTextIndex];
            scope.results = {};
            scope.results.answer = [];
            scope.results.points = 0;
            scope.pointsPerQuestion = scope.task.points / 1;

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
                            if (scope.task.correct != -1) {
                                if (scope.ans == scope.task.correct) {
                                    scope.results.points = scope.task.points;
                                }

                            }
                            //else - the user get all the points
                            else {
                                scope.results.points = scope.task.points;
                            }
                        }
                        //TODO: play the right sound


                    }
                    else {
                        //show the wrong popup
                        scope.showAnswerIndication = true;
                        scope.showAnswerRight = false;
                        //save the data to the server
                        scope.results.answer = scope.ans;

                        //TODO: play the wrong sound

                    }


                    setTimeout(function () {
                        //round the results points 
                        scope.results.points = Math.round(scope.results.points);
                        //Perform end mission function.
                        scope.endMission(scope.results); //the param is the answers of user

                    }, 1500);
                }
                else {
                    scope.results.points = scope.task.points;
                    //Perform end mission function.
                    scope.endMission(scope.results); //the param is the answers of user
                }
            }

            scope.$on('closeMission', function (event, data) {
                //round the results points 
                scope.results.points = Math.round(scope.results.points);
                scope.endMission(scope.results);
            });


        },
        replace: true
    };
} ]);