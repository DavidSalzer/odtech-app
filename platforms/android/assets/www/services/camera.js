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

                pictures[photoClicked] = { imgUri: imageURI };

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

            var onVideoSuccess = function (videoURI) { //take photo success

                path = videoURI[0].fullPath;
                alert(path);
                videos[_videoClicked] = { videoUri: path };

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
        getPictures: function () { // get saved photos
            return pictures;
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

            imgUrlF = pictures[photoClicked].imgUri;

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
        }
    }

} ]);
