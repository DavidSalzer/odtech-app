odtechApp.directive('multiQuestion', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './features/multiQuestion/multiQuestion.html',
        link: function (scope, el, attrs) {
            scope.missionData = scope.task;
            //if the mission has been made
            scope.firstTime = true;
            if (scope.missionData.status == 'answer') {
                $timeout(function () {
                    scope.firstTime = false;
                }, 0)
            }
            
            //init the first question
            scope.currentQuestion = 0;
            scope.currentCorrectAnswer = scope.missionData.questions[0].correctQuestionIndex;
            scope.showAnswerIndication = false;
            scope.showAnswerRight = false;
            //set the correct answer text
            scope.rightAnswerTextIndex = scope.missionData.questions[scope.currentQuestion].correctQuestionIndex;
            scope.rightAnswerText = scope.missionData.questions[scope.currentQuestion].answers[scope.rightAnswerTextIndex]
            scope.results = {};
            scope.results.answer = [];
            scope.results.points = 0;
            scope.pointsPerQuestion = scope.missionData.points / scope.missionData.questions.length;

            scope.answerClick = function (index) {
                //if the answer that clicked is correct
                if (index == scope.currentCorrectAnswer) {
                    //show the right popup
                    scope.showAnswerIndication = true;
                    scope.showAnswerRight = true;

                    //save the data to the server
                    scope.results.answer[scope.currentQuestion] = true;
                    //get point, if the answer was sent in time
                    if (!scope.endTimer) {
                        scope.results.points += scope.pointsPerQuestion;
                    }
                    //play the right sound
                    $rootScope.$broadcast('multiQuestionAnswerRight', {});

                }
                else {
                    //show the wrong popup
                    scope.showAnswerIndication = true;
                    scope.showAnswerRight = false;
                    //save the data to the server
                    scope.results.answer[scope.currentQuestion] = false;

                    //play the wrong sound
                    $rootScope.$broadcast('multiQuestionAnswerWrong', {});
                }

                setTimeout(function () {
                    //show the next question -if exist
                    if (scope.missionData.questions.length > scope.currentQuestion + 1) {
                        $timeout(function () {
                            scope.showAnswerIndication = false;
                            scope.showAnswerRight = false;
                        }, 0)
                        scope.currentQuestion++;
                        //set the correct answer text and index
                        scope.currentCorrectAnswer = scope.missionData.questions[scope.currentQuestion].correctQuestionIndex;
                        scope.rightAnswerText = scope.missionData.questions[scope.currentQuestion].answers[scope.currentCorrectAnswer];
                    }

                    //if there are no more questions -show the end screen
                    else {
                        //round the results points 
                        scope.results.points = Math.round(scope.results.points);
                        //Perform end mission function.
                        scope.endMission(scope.results,scope.missionData); //the param is the answers of user

                    }

                }, 1500);
            }

            scope.$on('closeMissionAndSendAnswer', function (event, data) {
               
                //round the results points 
                scope.results.points = Math.round(scope.results.points);
                scope.endMission(scope.results,scope.missionData);
            });

        },
        replace: true
    };


} ]);