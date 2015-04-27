odtechApp.directive('multiQuestion', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: './features/multiQuestion/multiQuestion.html',
        link: function (scope, el, attrs) {
            //if the mission has been made
            scope.firstTime = true;
            if (scope.task.status == 'answer') {
                $timeout(function () {
                    scope.firstTime = false;
                }, 0)
            }

            //init the first question
            scope.currentQuestion = 0;
            scope.currentCorrectAnswer = scope.task.questions[0].correctQuestionIndex;
            scope.showAnswerIndication = false;
            scope.showAnswerRight = false;
            //set the correct answer text
            scope.rightAnswerTextIndex = scope.task.questions[scope.currentQuestion].correctQuestionIndex;
            scope.rightAnswerText = scope.task.questions[scope.currentQuestion].answers[scope.rightAnswerTextIndex]
            scope.results = {};
            scope.results.answer = [];
            scope.results.points = 0;
            scope.pointsPerQuestion = scope.task.points / scope.task.questions.length;

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
                    //TODO: play the right sound


                }
                else {
                    //show the wrong popup
                    scope.showAnswerIndication = true;
                    scope.showAnswerRight = false;
                    //save the data to the server
                    scope.results.answer[scope.currentQuestion] = false;

                    //TODO: play the wrong sound

                }

                setTimeout(function () {
                    //show the next question -if exist
                    if (scope.task.questions.length > scope.currentQuestion + 1) {
                        scope.currentQuestion++;
                        scope.showAnswerIndication = false;
                        scope.showAnswerRight = false;
                        //set the correct answer text and index
                        scope.currentCorrectAnswer = scope.task.questions[scope.currentQuestion].correctQuestionIndex;
                        scope.rightAnswerText = scope.task.questions[scope.currentQuestion].answers[scope.currentCorrectAnswer];
                    }

                    //if there are no more questions -show the end screen
                    else {
                        //round the results points 
                        scope.results.points = Math.round(scope.results.points);
                        //Perform end mission function.
                        scope.endMission(scope.results); //the param is the answers of user

                    }

                }, 1500);
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