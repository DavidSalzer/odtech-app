odtechApp.directive('points', [ function () {
    return {
        restrict: 'E',
        templateUrl: './directives/points/points.html',
        link: function (scope, el, attrs) {           
        },
        replace: true
    };

    //מציג כמה נקודות יש עבור משימה בתאור ובהקדמה
    //במידה והצליחו את המשימה המשתמש מקבל את הנדוקות
    //מוצג לו מסך כל הכבוד הצלחת ומספר הנקודות
    //במידה ולא הצליח כותב לא נורא פעם הבאה
    //מופיע בפוטר מספר הנקודות הכולל

} ]);