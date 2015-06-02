odtechApp.directive('featureIcon', [ function () {
    return {
        restrict: 'E',
        templateUrl: './directives/featureIcon/featureIcon.html',
        link: function (scope, el, attrs) {           
        },
        replace: true
    };

    //מכיל רק את האיקון והעיצוב משתנה בהתאם לפיטצר וללקוח
} ]);