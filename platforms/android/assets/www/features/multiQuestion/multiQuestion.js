odtechApp.directive('multiQuestion', [function () {
    return {
        restrict: 'E',
        templateUrl: './features/multiQuestion/multiQuestion.html',
        link: function (scope, el, attrs) {
            //scope.questions = scope.task.questions;
            //console.log(scope.questions);
            scope.currentQuestion = 0;
        },
        replace: true
    };


} ]);