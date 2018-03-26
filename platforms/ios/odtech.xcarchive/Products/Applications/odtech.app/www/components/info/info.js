odtechApp.controller('info', ['$scope', '$state', function ($scope, $state) {
    $scope.infoText = "  OTDech- אפליקציית מובייל מותאמת לטאבלטים וסמארטפונים שפותחה בבית התוכנה קמביום בירוחם ונועדה להוות כלי טכנולוגי מלווה למידה התנסותית וחוויתית בשטח או במבנה, בעיר או בטבע.\n\n באמצעות האפליקציה תוכלו ליצור מסלולים שונים ומגוונים המשתמשים ביכולות הטכנולוגיות המצויות במכשירי המובייל ויחד עם התוכן שתצקו פנימה- תיצרו תהליך למידה עשיר, מגוון ואטקרטיבי.\n\nאפליקציית ODTech מגיעה עם מערכת ניהול זמינה, נוחה וידידותית שמאפשרת לצוות התוכן לעדכן בכל רגע נתון את התכנים ללא תלות בצוות טכנולוגי, כך שהאפליקצייה שלכם יכולה להשתנות ולהתחדש כל הזמן!";
    $scope.enterApp = function () {
       
        $state.transitionTo('mainNav');
       
    }
} ]);