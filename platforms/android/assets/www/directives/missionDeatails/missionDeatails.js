odtechApp.directive('missionDeatails', [function () {
    return {
        restrict: 'E',
        templateUrl: './directives/missionDeatails/missionDeatails.html',
        link: function (scope, el, attrs) {
            scope.showDeatails = true;
        },
        replace: true
    };

    //מציג את הטיימר למטה עם האיקון
    //משתמש בדירקטיבים של טיימר ואייקון
    //מציג את התאור במדיה ולוחצים על האיקון
    //לוחצים על איקס של התארו מעלים את התאור

} ]);