odtechApp.directive('didYouKnow', [ function () {
    return {
        restrict: 'E',
        templateUrl: './directives/didYouKnow/didYouKnow.html',
        link: function (scope, el, attrs) {           
        },
        replace: true
    };

    //מופיע במידה וקיים.
    //מציג לאחר סיום המשימה
    //כפתור המשך מעביר לעמוד הראשי
} ]);