odtechApp.factory('camera', ['$rootScope', '$stateParams', '$q', function ($rootScope, $stateParams, $q) {

    /*write what the function does.
    write main function
    */
    //var Up, Down, Left, Right;
    //var vid = '';

    //for photo
    var photoCenterD;
    var photoRightD;
    var photoDownD;
    var photoLeftD;
    var photoUpD;
    var photoClicked;
    var pictures = {};

    //for video
    var videos = {};
    var videoClicked;


    return {

        captureImage: function (_photoClicked) { // take photo
            var deferred = $q.defer();
            photoClicked = _photoClicked;
            var onImageSuccess = function (imageURI) { //take photo success

                pictures[photoClicked] = { uri: imageURI };

                deferred.resolve(imageURI);
            }
            var onFail = function (message) { //take photo failed
                alert('Failed because: ' + message);
                deferred.reject(message);
            }

            navigator.camera.getPicture(onImageSuccess, onFail, //take photo options and use plugin
                {
                quality: 49,
                destinationType: Camera.PictureSourceType.FILE_URI,
                targetWidth: 584,
                correctOrientation: true,
                saveToPhotoAlbum: true
            }
            );
            // return a promise
            return deferred.promise;
        },
        captureVideo: function (_videoClicked) { //take video
            var deferred = $q.defer();
            videoClicked = _videoClicked;

            var onVideoSuccess = function (uri) { //take photo success

                path = uri[0].fullPath;
             //   alert(path);
                videos[_videoClicked] = { uri: path };

                deferred.resolve(path);
            }
            var onFail = function (message) { //take photo failed
                alert('Failed because: ' + message);
                deferred.reject(message);
            }

            navigator.device.capture.captureVideo(onVideoSuccess, onFail, { limit: 1 });

            // return a promise
            return deferred.promise;
        },
        uploadPhoto: function (pictures, type, num) {
            var deferred = $q.defer();
            var uploaded = 0;
            results = [];
            var win = function (r) {
                console.log("Code = " + r.responseCode);
                console.log("Response = " + r.response);
                console.log("Sent = " + r.bytesSent);
            //    alert(r.response);
                r.response = (JSON.parse(r.response.substr(1)));
                results.push(r.response.res);
                uploaded++;
                if (uploaded == num) {
                    deferred.resolve(results);
                }
            }

            var fail = function (error) {
                alert("An error has occurred: Code = " + error.exception);
                deferred.reject(error);
            }

            var options = new FileUploadOptions();
            options.fileKey = "file";

            if (type == "img") {
                options.mimeType = "image/jpeg";
            } else if (type == "video") {
                options.mimeType = "video/mp4";
            }
            var params = new Object();
            options.params = params;
            options.chunkedMode = false;

            var ft = new FileTransfer();
            for (p in pictures) {
                request = {
                    type: "sendFileAnswer",
                    req: { uri: pictures[p].uri.substr(pictures[p].uri.lastIndexOf('/') + 1),
                        mid: $stateParams.missionId,
                        field: p,
                        type: type
                    }
                }
                params.reqArray = JSON.stringify(request);
                options.fileName = pictures[p].uri.substr(pictures[p].uri.lastIndexOf('/') + 1);
                ft.upload(pictures[p].uri, domain, win, fail, options);
            }

            return deferred.promise;

        },
        getPictures: function () { // get saved photos
            return pictures;
        },
       setPicturesAndVideos: function (pics, vids) { //set photos and videos
             pictures = pics;

             videos = vids
        },
        getPhotoClicked: function () { // get last clicked photos
            return photoClicked;
        },
        getVideos: function () { // get saved photos
            return videos;
        },
        getVideoClicked: function () { // get last clicked photos
            return videoClicked;
        },
        addDescription: function (description) { // add description to photo and save object for send to server
            pictures[photoClicked].description = description;

            imgUrlF = pictures[photoClicked].uri;

            switch (photoClicked) {
                case 'photoCenter':
                    photoCenterD = { id: '', content: imgUrlF, title: description, type: 'img' };
                    break;
                case 'photoRight':
                    photoRightD = { id: '', content: imgUrlF, title: description, type: 'img' };
                    break;
                case 'photoLeft':
                    photoLeftD = { id: '', content: imgUrlF, title: description, type: 'img' };
                    break;
                case 'photoDown':
                    photoDownD = { id: '', content: imgUrlF, title: description, type: 'img' };
                    break;
                case 'photoUp':
                    photoUpD = { id: '', content: imgUrlF, title: description, type: 'img' };
                    break;
            }

        },
        deletePhoto: function (_photoClicked) { // delete photo
            pictures[_photoClicked] = undefined;
        },
        deleteVideo: function (_photoClicked) { // delete photo
            videos[_photoClicked] = undefined;
        },
        getPicture: function (options) {

            // init $q
            var deferred = $q.defer();

            // set some default options
            var defaultOptions = {
                quality: 100,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.FILE_URI,
                mediaType: Camera.MediaType.PICTURE,
                correctOrientation: false,
                encodingType: Camera.EncodingType.JPEG
            };

            // allow overriding the default options
            options = angular.extend(defaultOptions, options);
            var failFile = function (e) { alert("error failFile"); };
            var failSystem = function (e) { alert("error failSystem"); };
            var gotFileEntry = function (fileEntry) {
                console.log("got image file entry: " + fileEntry.fullPath);
                var encodedData = {};

                encodedData.imgData = fileEntry.toURL();
                encodedData.fileText = fileEntry.name;

                //get file type from name string and return MIME type
                var regExp = /(?:\.([^.]+))?$/;
                var type = regExp.exec(fileEntry.name)[1];
                switch (type) {
                    case 'png':
                        encodedData.fileType = "image/png";
                        break;
                    case 'jpg':
                        encodedData.fileType = "image/jpg";
                        break;
                    case 'jpeg':
                        encodedData.fileType = "image/jpeg";
                        break;
                    case 'bmp':
                        encodedData.fileType = "image/bmp";
                        break;
                    case 'gif':
                        encodedData.fileType = "image/gif";
                        break;
                    default:
                        encodedData.fileType = "image/png";
                }


                fileEntry.file(function (fileEntry) {
                    console.log("Size = " + fileEntry.size);
                    if (fileEntry.size > 4000000) {
                        alert('בחרת תמונה גדולה מידי. עליך לבחור תמונה עד 4MB');
                    }
                    else {
                        deferred.resolve(encodedData);
                    }
                });

            };


            // success callback
            var success = function (imageURI) {
                $rootScope.$apply(function () {
                    console.log(imageURI);
                    //A hack that you should include to catch bug on Android 4.4 (bug < Cordova 3.5):
                    if (imageURI.substring(0, 21) == "content://com.android") {
                        var photo_split = imageURI.split("%3A");
                        imageURI = "content://media/external/images/media/" + photo_split[1];
                    }
                    window.resolveLocalFileSystemURI(imageURI, gotFileEntry, failSystem);

                });
            };

            // fail callback
            var fail = function (message) {
                $rootScope.$apply(function () {
                    deferred.reject(message);
                });
            };

            // open camera via cordova
            navigator.camera.getPicture(success, fail, options);



            // return a promise
            return deferred.promise;

        }
    }

} ]);
