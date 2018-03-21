odtechApp.factory('camera', ['$rootScope', '$stateParams', '$q', '$http', function ($rootScope, $stateParams, $q, $http) {

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

    //var timeStart;
    //$rootScope.$on('logout', function (ngRepeatFinishedEvent) {
    //    //clear the pictures from camera array
    //        camera.setPicturesAndVideos({}, {});
    //});

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
            if (isIOS || isIPad) {
                navigator.camera.getPicture(onImageSuccess, onFail, //take photo options and use plugin
                {
                quality: 85,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                 targetWidth: 584,
                correctOrientation: true,
                saveToPhotoAlbum: true
            }
            );

        }
        else {
            navigator.camera.getPicture(onImageSuccess, onFail, //take photo options and use plugin
                {
                quality: 85,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                //  targetWidth: 584,
                correctOrientation: true,
                saveToPhotoAlbum: true,
                 mediaType: navigator.camera.MediaType.PICTURE,
                 encodingType: navigator.camera.EncodingType.JPEG



            }
            );
        }

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
            alert('Failed because: ' + message.message);
            deferred.reject(message);
        }

        navigator.device.capture.captureVideo(onVideoSuccess, onFail, { limit: 1,quality: 70 });

        // return a promise
        return deferred.promise;
    },
    uploadPhoto: function (pictures, type, num, uploadType) {
        var deferred = $q.defer();
        var uploaded = 0;
        results = [];
        var win = function (r) {
            endTime = new Date();
            //console.log('start: ' + timeStart + ' end: ' + endTime);
            //alert('start: ' + timeStart.toString() + ' end: ' + endTime.toString());
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
            //    alert(r.response);
            r.response = (JSON.parse(r.response.trim()));
            results.push(r.response.res);
            uploaded++;
            // if all the files uploaded
            if (uploaded == num) {
                deferred.resolve(results);
            }
        }

        var fail = function (error) {
             //alert("An error has occurred: Code = " + error.exception);
            deferred.reject(error);
        }

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.chunkedMode = true;
        if (type == "img") {
            options.mimeType = "image/jpeg";
        } else if (type == "video") {
            options.mimeType = "video/mp4";
        }
        var params = new Object();
        options.params = params;
        options.chunkedMode = true;

        var ft = new FileTransfer();
        for (p in pictures) {
            //capture by menu btn
            if (uploadType == 'menu') {

                request = {
                    type: "insertPhotoToAppUser",
                    req: { uri: pictures[p].uri.substr(pictures[p].uri.lastIndexOf('/') + 1),
                        field: p,
                        type: type
                    }
                }


            }
            //capture by home pae btn
            else if (uploadType == 'main') {
                request = {
                    type: "uploadPhotoByCid",
                    req: { uri: pictures[p].uri.substr(pictures[p].uri.lastIndexOf('/') + 1),
                        field: p,
                        type: type,
                        cid: $rootScope.cid
                    }
                }
            }
            //capture by mission
            else {
                request = {
                    type: "sendFileAnswer",
                    req: { uri: pictures[p].uri.substr(pictures[p].uri.lastIndexOf('/') + 1),
                        mid: $stateParams.missionId,
                        field: p,
                        type: type
                    }
                }
            }

            params.reqArray = JSON.stringify(request);
            options.fileName = pictures[p].uri.substr(pictures[p].uri.lastIndexOf('/') + 1);
            ft.upload(pictures[p].uri, domain, win, fail, options,true);
        }

        return deferred.promise;

    },
    uploadPhotoFormData: function (pictures, type, num) {
        var deferred = $q.defer();
        var uploaded = 0;
        results = [];

        for (p in pictures) {
            request = {
                type: "sendFileAnswer",
                req: { uri: pictures[p].uri.substr(pictures[p].uri.lastIndexOf('/') + 1),
                    mid: $stateParams.missionId,
                    fileName: pictures[p].uri,
                    field: p,
                    type: type
                }
            }

            //fd.append('file', pictures[p].file);
            //fd.append(fileName, pictures[p].uri.substr(pictures[p].uri.lastIndexOf('/') + 1));
            pictures[p].fd.append('reqArray', JSON.stringify(request));
            console.log(pictures);
            if (type == "img") {
                pictures[p].fd.append('mimeType', "image/jpeg");
            } else if (type == "video") {
                pictures[p].fd.append('mimeType', "video/mp4");
            }
            $http.post(domain, pictures[p].fd, { //imgDomain+'uloadImage.php'
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .success(function (data) {
                    results.push(data.res);
                    uploaded++;
                    if (uploaded == num) {
                        deferred.resolve(results);
                    }
                })
                .error(function (error) {
                    //   alert("An error has occurred: Code = " + error.exception);
                    deferred.reject(error);
                })
        }

        return deferred.promise;

    },

    editVideo: function (video, type, num) {

        var deferred = $q.defer();
        //timeStart = new Date();
        // options used with transcodeVideo function
        // VideoEditorOptions is global, no need to declare it
        var VideoEditorOptions = {
            OptimizeForNetworkUse: {
                NO: 0,
                YES: 1
            },
            OutputFileType: {
                M4V: 0,
                MPEG4: 1,
                M4A: 2,
                QUICK_TIME: 3
            }
        };

        //function videoCaptureSuccess(mediaFiles) {
            // Wrap this below in a ~100 ms timeout on Android if
            // you just recorded the video using the capture plugin.
            // For some reason it is not available immediately in the file system.

            var file = video;
            var videoFileName = '' + new Date().getTime(); // I suggest a uuid

            VideoEditor.transcodeVideo(
                videoTranscodeSuccess,
                videoTranscodeError,
                {
                    fileUri: video,
                    outputFileName: videoFileName,
                    outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
                    optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES,
                    saveToLibrary: false,
                    maintainAspectRatio: true,
                    //width: 1280,
                    width: 1280,
                    //height: 640,
                    videoBitrate: 500000, // 1 megabit
                    audioChannels: 2,
                    audioSampleRate: 44100,
                    audioBitrate: 64000, // 128 kilobits
                    progress: function(info) {
                        console.log('transcodeVideo progress callback, info: ' + info);
                    }
                }
            );
        //}

        function videoTranscodeSuccess(result) {
            // result is the path to the transcoded video on the device
            console.log('videoTranscodeSuccess, result: ' + result);
            deferred.resolve(result);
        }

        function videoTranscodeError(err) {
            console.log('videoTranscodeError, err: ' + err);
            deferred.reject(err);
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
                             var defaultOptions={}



                             if (isIOS || isIPad) {
                             // set some default options
                             defaultOptions = {
                             quality: 85,
                             //sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                             destinationType: navigator.camera.DestinationType.FILE_URI,
                             mediaType: navigator.camera.MediaType.PICTURE,
                             correctOrientation: true,
                             encodingType: navigator.camera.EncodingType.JPEG
                             };
                             // allow overriding the default options
                             options = angular.extend(defaultOptions, options);

                             navigator.camera.getPicture(success, fail, options);                             }
                             else{



                             // set some default options
                             defaultOptions = {
                             quality: 85,
                             //sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                             destinationType: navigator.camera.DestinationType.FILE_URI,
                             mediaType: navigator.camera.MediaType.PICTURE,
                             correctOrientation: true,
                             encodingType: navigator.camera.EncodingType.JPEG
                             };
                             // allow overriding the default options
                             options = angular.extend(defaultOptions, options);

                             navigator.camera.getPicture(success, fail, options);
                             }// open camera via cordova




        // return a promise
        return deferred.promise;

    }



}

} ]);
