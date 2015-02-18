odtechApp.directive('multiQuestion', [function () {
    return {
        restrict: 'E',
        templateUrl: './features/multiQuestion/multiQuestion.html',
        link: function (scope, el, attrs) {
            //init the first question
            scope.currentQuestion = 0;
            scope.currentCorrectAnswer = scope.task.questions[0].correctQuestionIndex;
            scope.showAnswerIndication = false;
            scope.showAnswerRight = false;
            //set the correct answer text
            scope.rightAnswerTextIndex = scope.task.questions[scope.currentQuestion].correctQuestionIndex;
            scope.rightAnswerText = scope.task.questions[scope.currentQuestion].answers[scope.rightAnswerTextIndex]
            scope.clickedAnswers = [];

            scope.answerClick = function (index) {
                //if the answer that clicked is correct
                if (index == scope.currentCorrectAnswer) {
                    //show the right popup
                    scope.showAnswerIndication = true;
                    scope.showAnswerRight = true;

                    //save the data to the server
                    scope.clickedAnswers[scope.currentQuestion] = true;

                    //TODO: play the right sound


                }
                else {
                    //show the wrong popup
                    scope.showAnswerIndication = true;
                    scope.showAnswerRight = false;
                    //save the data to the server
                    scope.clickedAnswers[scope.currentQuestion] = false;

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
                        //the data for server
                        scope.clickedAnswers;
                        alert('המשימה הסתיימה!')
                    }

                }, 3500);
            }

        },
        replace: true
    };


} ]);