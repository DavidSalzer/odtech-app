odtechApp.directive('missionIntroduction', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'E',
        templateUrl: './directives/missionIntroduction/missionIntroduction.html',
        scope:true,    
        link: function (scope, el, attrs) {
            scope.imgDomain = imgDomain;
            scope.popupShow = true;
            
            scope.openLargeImage = function () {
                $rootScope.$broadcast('openLargeImage');
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