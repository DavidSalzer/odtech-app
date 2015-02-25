odtechApp.directive('missionIntroduction', [function () {
    return {
        restrict: 'E',
        templateUrl: './directives/missionIntroduction/missionIntroduction.html',
        link: function (scope, el, attrs) {
            //scope.showIntroduction = true;
            scope.popupShow = true;
            scope.hideIntroduction = function () {
                //scope.showIntroduction = false;
                scope.startMission = true;
                scope.popupShow = false;
                console.log(scope);
            }
        },
        replace: true
    };

    //מציג את התקציר ואת התמונה 
    //לפני המשימה
    //להראות שאשר לגלול
    //צריך להתאים לכל המכשירים
    //ברגע שלוחצים על צאו לדרך מעביר למשימה והטיימר מתחיל
} ]);