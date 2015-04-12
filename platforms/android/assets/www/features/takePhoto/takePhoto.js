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
            scope.showFinishQuestion = false;

            scope.results = {};
            scope.results.answer = {};
            scope.results.points = 0;
            scope.firstTime = true;
            //check if this first time that we doing the mission or we made made it befor
            if (scope.task.status == 'answer') {
                //alert('This task has been made');
                $timeout(function () {
                    scope.firstTime = false;
                    scope.task.answer.data =scope.task.answer.data;
                    for (pic in scope.task.answer.data) {
                        scope.photoSaved[pic] = true;
                        scope.pictures[pic] = { uri: imgDomain + scope.task.answer.data[pic] };
                    }
                }, 0)

            }

            // take photo
            scope.captureImage = function (photoClicked) {
                camera.captureImage(photoClicked)
                .then(function (data) {
                    $timeout(function () {
                        scope.pictures = camera.getPictures();
                        scope.photoClicked = photoClicked;
                        //scope.openImg = true;
                        scope.openImg = false;
                        scope.photoSaved[scope.photoClicked] = true;
                        scope.countPhotos++;
                        if (scope.countPhotos == scope.task.countPhoto) {
                            //alert("סיימת את המשימה:)");
                            //if the user take the last photo - display the "is finished question popup"

                            $timeout(function () {
                                scope.showFinishQuestion = true;
                            }, 0);
                        }
                    }, 0);
                });
            }
            //after the user click on the finish question poopup - upload to server
            scope.uploadImages = function () {
                scope.showFinishQuestion = false;
                camera.uploadPhoto(scope.pictures, "img", scope.task.countPhoto)
                            .then(function (data) {
                                //  result = {};
                                for (index in data) {
                                    for (field in data[index]) {
                                        scope.results.answer[field] = data[index][field];
                                        //get point, if the answer was sent in time
                                        if (!scope.endTimer) {
                                            scope.results.points = scope.task.points;
                                        }
                                    }
                                }
                                scope.endMission(scope.results);
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


            ///////////////////////////////////////////////////////////////////////////////////////// for browsers
            scope.imageChosen = function (input) {
                //  alert('d');
                if (input.files && input.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        //set the preview image
                        //$scope.setPreviewImg(e.target.result);
                        // alert(0);
                        // $('#blah').attr('src', e.target.result);
                    }

                    reader.readAsDataURL(input.files[0]);
                }
            }

            scope.$on('closeMission', function (event, data) {
                scope.endMission(scope.results);
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