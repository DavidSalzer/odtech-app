odtechApp.directive('takeVideo', [ function () {
    return {
        restrict: 'E',
        templateUrl: './features/takeVideo/takeVideo.html',
        link: function (scope, el, attrs) {           
        },
        replace: true
    };

    
    //  הקוביה צריכה להיות לחיצה שפותחת את המצלמה וידאו
    //קליטת אישור בוידאו, 
    //מופיע מסך של נתינת שם לוידאו
    //אישור לשם של הוידאו והוא עובר למסך הראשי של הפיטצר
    //יש כפתור איקס למחיקת הוידאו ולצילום חוזר
    
    //לזהות שסיימו לצלם ומקפיץ פופאפ סיימתם וכפתור המשך...

    //כניסה אחרי מציגה את הוידאו?

} ]);