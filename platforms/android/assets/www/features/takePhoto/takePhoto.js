odtechApp.directive('takePhoto', ['camera', function (camera) {
    return {
        restrict: 'E',
        templateUrl: './features/takePhoto/takePhoto.html',
        link: function (scope, el, attrs) {
            el.on('click', function () {
                camera.captureImage();
            });
        },
        replace: true
    };

    //לדעת האם יש 1-5 תמונות ולהציב את הקוביות בהתאם למסך
    //כל קוביה צריכה להיות לחיצה שפותחת את המצלמה
    //קליטת אישור התמונה, 
    //מופיע מסך של נתינת שם לתמונה
    //אישור לשם של התמונה והתמונה עוברת למסך הראשי של הפיטצר
    //על כל תמונה
    //יש אפשרות למחוק כל תמונה ואז צריך לצלם תמונה נוספת.
    //לזהות שסיימו לצלם את כל התמונות שהיה צריך ומקפיץ פופאפ סיימתם וכפתור המשך...

    //כניסה אחרי ביצוע המשימה מציגה את התמונות
} ]);