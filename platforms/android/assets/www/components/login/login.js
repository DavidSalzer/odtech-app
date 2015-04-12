odtechApp.controller('login', ['$rootScope', '$scope', '$state', 'server', '$timeout', 'camera', function ($rootScope, $scope, $state, server, $timeout, camera) {
    $scope.loginFirstPage = true;
    $scope.userName = '';
    //check if the user login
    server.request({ "type": "getAppUser", "req": {} })
    .then(function (data) {
        //if user login
        if (data.res && data.res.name) {
            $rootScope.showDescription = true; //show day description in mainNav.
            $state.transitionTo('mainNav');
        }
        //if logged in user has no userName 
        else if (data.res && data.res.email) {
            $timeout(function () {
                $scope.loginFirstPage = false;
            }, 0)
        }
        //if the user logout
        else{
           $rootScope.$broadcast('logout', {}); 
        }
    })

    //general error need to pass to global file.
    $scope.errorMsg = {};
    $scope.errorMsg.generalError = 'אירעה שגיאה, בדקו חיבור לאינטרנט או נסו שנית';

    //Send login details to server.
    $scope.sendLogin = function () {
        //validations
        if (!$scope.loginForm.emailBox.$valid || !$scope.loginForm.code.$valid) {
            $scope.mailnotValid = true;
            $scope.codenotValid = true;
            return;
        }

        request = {
            type: "appUserLogin",
            req: {
                email: $scope.email,
                cid: cid,
                groupCode: $scope.groupCode
            }
        }

        server.request(request)
        .then(function (data) {
            console.log(data);
            //if success.
            if (!data.res.error) {
                //if it old user go to missions else update user details. 
                if (data.res.name) {
                    $rootScope.showDescription = true; //show day description in mainNav.
                    $state.transitionTo('mainNav');
                }
                else {
                    $timeout(function () {
                        $scope.loginFirstPage = false;
                        $scope.loginError = false;
                    }, 0)
                }

            }
            else {
                $timeout(function () {
                    $scope.loginError = true;
                    $scope.loginErrorMsg = 'קוד הקבוצה אינו קיים';
                }, 0)
            }

        },
        function () {
            $timeout(function () {
                $scope.loginError = true;
                $scope.loginErrorMsg = $scope.errorMsg.generalError;
            }, 0)
        })


    }

    //Send user details (userName and image) to server.
    $scope.sendUsername = function () {
        //validations
        if (!$scope.userForm.nickName.$valid) {
            $scope.namenotValid = true;
            return;
        }
        request = {
            type: "updateAppUser",
            req: {
                name: $scope.userName,
                imgfiled: 'img',
                isFile: true
            }
        }

        //if has url to user image on server. for android 4.4.2
        if ($scope.imgServerUrl) {
            request.req.imgfiled = $scope.imgServerUrl;
            request.req.isFile = false;
        }

        var file = new FormData(document.forms.namedItem("userForm"));
        file.append('reqArray', JSON.stringify(request));
        console.log(file);

        server.request(file)
        .then(function (data) {
            console.log(data);
            //if success.
            if (!data.res.error) {
                $rootScope.showDescription = true; //show day description in mainNav.
                $state.transitionTo('mainNav');
            }
            else {

            }

        },
        function () {

        })
    }

    //For 4.4.2, get image from device.
    $scope.captureImage = function () {
        camera.getPicture()
        .then(function (data) {
            $timeout(function () {
                $scope.imgurl = data.imgData;
                $scope.setPreviewImg($scope.imgurl);
                $scope.pictures = [];
                $scope.pictures.push({ uri: $scope.imgurl })
                camera.uploadPhoto($scope.pictures, "img", 1)
                .then(function (data) {
                    $scope.imgServerUrl = data[0][0];

                });
            }, 0);
        });
    }

    $scope.email = '';
    $scope.groupCode = '';
    $scope.mailnotValid = false;
    $scope.codenotValid = false;
    $scope.namenotValid = false;
    $scope.changeInput = function (type) {
        switch (type) {
            case 'mail':
                $scope.mailnotValid = true;
                break;
            case 'code':
                $scope.codenotValid = true;
                break;
            case 'name':
                $scope.namenotValid = true;
                break;
        }
    }


    $scope.uploadImg = '';
    $scope.imageChosen = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                //set the preview image
                $scope.setPreviewImg(e.target.result);
                // $('#blah').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }
    //set the preview image after the user chose an image
    $scope.showPreviewSrc = false;
    $scope.setPreviewImg = function (src) {
        $scope.previewSrc = src;

        $timeout(function () {
            $scope.showPreviewSrc = true;
        }, 0)

    }
} ]);