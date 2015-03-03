odtechApp.directive('didYouKnow', ['$state', function ($state) {
    return {
        restrict: 'E',
        templateUrl: './directives/didYouKnow/didYouKnow.html',
        link: function (scope, el, attrs) {
            scope.hideDidYouKnow = function () {
                console.log(scope);
                scope.showDidYouKnow = false;
                if (scope.task.next) {
                    
                }
                else {
                    $state.transitionTo('mainNav');
                }
            }
        },
        replace: true
    };

    //מופיע במידה וקיים.
    //מציג לאחר סיום המשימה
    //כפתור המשך מעביר לעמוד הראשי
} ]);