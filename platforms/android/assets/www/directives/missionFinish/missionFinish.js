odtechApp.directive('missionFinish', [ function () {
    return {
        restrict: 'E',
        templateUrl: './directives/missionFinish/missionFinish.html',
        link: function (scope, el, attrs) {           
        },
        replace: true
    };

    //מכיל רק את האיקון והעיצוב משתנה בהתאם לפיטצר וללקוח
} ]);