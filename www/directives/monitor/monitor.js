odtechApp.directive('monitor', [ function () {
    return {
        restrict: 'E',
        templateUrl: './directives/monitor/monitor.html',
        link: function (scope, el, attrs) {           
        },
        replace: true
    };

    //נכנסנים למוניטור
    //יש מסך בחירה של יום הפעילות
    //מציג את מפה עם כל הנקודות של כל המשתמשים שמחוברים ליום פעילות הזה
    //לחיצה על כל נקודה מראה את מספר המשימה שהוא נמצא בה
    //ומה התוכן האחרון שהוא שלח
} ]);