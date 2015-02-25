odtechApp.directive('takePhoto', ['camera', '$timeout', function (camera, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './features/takePhoto/takePhoto.html',
        link: function (scope, el, attrs) {
            scope.photoSaved = {};
            scope.pictures = {};
            scope.photoCenter = 'photoCenter';
            scope.photoUp = 'photoUp';
            scope.photoDown = 'photoDown';
            scope.photoLeft = 'photoLeft';
            scope.photoRight = 'photoRight';
            //scope.task.countPhoto = 3;
            scope.countPhotos = 0;

            // take photo
            scope.captureImage = function (photoClicked) { 
                camera.captureImage(photoClicked)
                .then(function (data) {
                    $timeout(function () {
                        scope.pictures = camera.getPictures();
                        scope.photoClicked = photoClicked; 
                        //scope.openImg = true;
                    }, 0);
                });
            }

            // add description to photo
            scope.addDescription = function () { 
                camera.addDescription(scope.description);
                scope.description = '';
                $timeout(function () {
                    scope.openImg = false;
                    scope.photoSaved[scope.photoClicked] = true;
                    scope.countPhotos++;
                    if (scope.countPhotos == scope.task.countPhoto) {
                        alert("סיימת את המשימה:)");
                    }
                }, 0);
            }

             // delete photo
            scope.deletePhoto = function (photoClicked) { 
                camera.deletePhoto(photoClicked);
                $timeout(function () {
                    scope.pictures = camera.getPictures();
                    scope.photoSaved[photoClicked] = false;
                    scope.countPhotos--;
                }, 0);
            }
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