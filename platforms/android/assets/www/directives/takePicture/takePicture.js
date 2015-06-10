torScoreApp.directive('takePicture', ['$state', '$rootScope', '$q', '$timeout', function ($state, $rootScope, $q, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/takePicture/takePicture.html',
        link: function (scope, el, attrs) {
            scope.commentText = {}
            scope.commentText.text = ""
            scope.mainPic = 'img/takePic5.jpg';
            scope.smallpic = ''
            scope.smallpicdemo = 'img/takePic4.jpg'
            scope.isTakePic = true;
            scope.changePictures = function () {
                temp = scope.mainPic;
                scope.mainPic = scope.smallpic;
                scope.smallpic = temp;
            };
            scope.addPictures = function () {
                scope.smallpic = 'img/takePic4.jpg'
                scope.smallpicdemo = '';
            };

            scope.goToToSummary = function () {
                $state.transitionTo('summary');
            }

            scope.deleteImg = function (type) {
                if (type == "big") {
                    //if there is a small img - it become the big
                    if (scope.smallpic != "") {
                        scope.mainPic = scope.smallpic;
                        scope.smallpic = "";
                    }
                    //else- the big delete and the state is the first state with 2 icons
                    else {
                        scope.mainPic = "img/takePic5.jpg";
                        scope.isTakePic = true;
                    }

                }
                else if (type == "small") {
                    scope.smallpic = "";
                }
            }
            scope.getPicture = function (image_num, source) {

                var sourceType = "";

                // init $q
                var deferred = $q.defer();
                if (source == 'CAMERA') {
                    sourceType = Camera.PictureSourceType.CAMERA
                }
                else if (source == 'PHOTOLIBRARY') {
                    sourceType = Camera.PictureSourceType.PHOTOLIBRARY
                }
                // set some default options
                var options = {
                    quality: 100,
                    destinationType: Camera.DestinationType.FILE_URI,
                    mediaType: Camera.MediaType.PICTURE,
                    correctOrientation: true,
                    encodingType: Camera.EncodingType.JPEG,
                    sourceType: sourceType
                };
                // success callback
                var success = function (imageURI) {
                    console.log(imageURI);
                    //A hack that you should include to catch bug on Android 4.4 (bug < Cordova 3.5):
                    if (imageURI.substring(0, 21) == "content://com.android") {
                        var photo_split = imageURI.split("%3A");
                        imageURI = "content://media/external/images/media/" + photo_split[1];
                    }
                    $timeout(function () {
                        if (image_num == 1) {
                            scope.mainPic = imageURI;
                        } else if (image_num == 2) {
                            scope.smallpic = imageURI;
                            scope.smallpicdemo = '';
                        }
                        scope.isTakePic = false;
                    }, 0);
                    deferred.resolve(imageURI);
                };

                // fail callback
                var fail = function (message) {
                    deferred.reject(message);
                };

                // open camera via cordova
                navigator.camera.getPicture(success, fail, options);



                // return a promise
                return deferred.promise;

            }

            $rootScope.$on('updateInput', function (event, args, data) {
                scope.commentText.text = args.text;


            });
            //listener to end report - check if init pictures.
            $rootScope.$on('endReport', function (event, args) {
                //if its not duplicate - clear the images
                if (args.type != 'duplicate') {
                    scope.deleteImg("small")
                    scope.deleteImg("big")
                }
                scope.commentText.text = "";
            });
        },
        replace: true
    };


    var d = 15;



} ]);