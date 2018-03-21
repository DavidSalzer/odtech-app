odtechApp.controller('login', ['$rootScope', '$scope', '$state', 'server', '$timeout', 'camera', '$filter', function ($rootScope, $scope, $state, server, $timeout, camera, $filter) {
    $scope.loginFirstPage = true;
    $rootScope.isStationArch = false;
    $scope.userName = '';
    $scope.btn_text = $filter('localizedFilter')('_signUp_');

    $rootScope.$broadcast('stopLocationWatcher', {});

    //if there is main page - show group code field
    if ($rootScope.isPreLoginPage) {
        server.request({ "type": "getAppUser", "req": {} })
         .then(function (data) {
             //if the user login
             if (data.res) {
                 //if the user has gid - go to mainNav/stages
                 if (parseInt(data.res.gid) != 0) {
                     $scope.transitionByArch(data);
                 }
                 //else - show the group code input
                 {
                     $scope.showGroupCodeField = true;
                 }

             }
             //if the usernotlogin - go to login page
             else {
                 //if there is main page - go to user login page
                 if ($rootScope.isPreLoginPage) {
                     $state.transitionTo('userLogin');
                 }
                 else {
                     $state.transitionTo('login');
                 }

             }


         });
    }
    //else - check if the user login
    else {
        //check if the user login
        server.request({ "type": "getAppUser", "req": {} })
    .then(function (data) {
        //if user login
        if (data.res && data.res.name) {
            //  $rootScope.showDescription = true; //show day description in mainNav.
            $rootScope.showDayDescription = false;
            $scope.transitionByArch(data);
            $rootScope.$broadcast('showDescription', {});
        }
        //if logged in user has no userName 
        else if (data.res && data.res.email) {
            if (parseInt(data.res.isStationArch)) {
                $rootScope.isStationArch = true;
            }
            //check if the format is group or singke travel
            $rootScope.isGroupTravel = !parseInt(data.res.isSuperActivitySingle);
            //set the tet on login btn by travel type
            if ($rootScope.isGroupTravel) {
                $scope.registerBtnText = $filter('localizedFilter')('_signUp_');
            }
            else {
                $scope.registerBtnText = $filter('localizedFilter')('_letsGo_');
            }
            $timeout(function () {
                $scope.loginFirstPage = false;
            }, 0);
        }
        //if the user logout
        else {
            $rootScope.$broadcast('logout', {});
        }
    });

    }

    //general error need to pass to global file.
    $scope.errorMsg = {};
    $scope.errorMsg.generalError = $filter('localizedFilter')('_connectionError_');

    //Send login details to server.
    $scope.sendLogin = function () {
        //validations
        if (!$scope.loginForm.emailBox.$valid || !$scope.loginForm.code.$valid) {
            $scope.mailnotValid = true;
            $scope.codenotValid = true;
            return;
        }
        //if the code is personal (vitamin c...)
        if (typeof isPersonalCode !== 'undefined' && isPersonalCode != false) {
            request = {
                type: "appUserLoginWithPersonal",
                req: {
                    email: $scope.email,
                    cid: cid,
                    personalGroupCode: $scope.groupCode
                }
            }
        }
        else {
            request = {
                type: "appUserLogin",
                req: {
                    email: $scope.email,
                    cid: cid,
                    groupCode: $scope.groupCode
                }
            };
        }

        console.log("appUserLogin");
        server.request(request)
        .then(function (data) {
            console.log(data);
            //if success.
            if (!data.res.error) {
                //if it old user go to groups page else update user details. 
                if (data.res.name) {
                    $rootScope.user = data.res;
                    if (parseInt(data.res.isStationArch)) {
                        $rootScope.isStationArch = true;
                    }
                    $scope.transitionByArch(data);


                }
                else {
                    $rootScope.user = data.res;
                    //if the day is a staging day -go to stages
                    if (parseInt(data.res.isStationArch)) {
                        $rootScope.isStationArch = true;
                    }
                    //set the travel type
                    $rootScope.isGroupTravel = !parseInt(data.res.isSuperActivitySingle);
                    //set the text on login btn by travel type
                    if ($rootScope.isGroupTravel) {
                        $scope.registerBtnText =  $filter('localizedFilter')('_signUp_');
                    }
                    else {
                        $scope.registerBtnText =  $filter('localizedFilter')('_letsGo_');
                    }

                    $timeout(function () {
                        $scope.loginFirstPage = false;
                        $scope.loginError = false;
                    }, 0);
                }

            }
            //group code not exist
            else {
                $timeout(function () {
                    $scope.loginError = true;
                    $scope.loginErrorMsg = $filter('localizedFilter')('_noGroupCode_');
                }, 0);
            }

        },
        function () {
            console.log("after appUserLogin");
            $timeout(function () {
                $scope.loginError = true;
                $scope.loginErrorMsg = $scope.errorMsg.generalError;
            }, 0);
        })

        $("input").blur();
    }
    $scope.showLoader = false;

    //Send user details (userName and image) to server.
    $scope.sendUsername = function () {

        //validations
        if (!$scope.userForm.nickName.$valid) {
            $scope.namenotValid = true;
            return;
        }
        else if (!$scope.imgServerUrl && $scope.imgurl) {
            $scope.showLoader = true;
            $timeout(function () {
                $scope.sendUsername()
            }, 100);
            return;
        }
        request = {
            type: "updateAppUser",
            req: {
                name: $scope.userName,
                imgfiled: 'img',
                isFile: true
            }
        };

        //if has url to user image on server. for android 4.4.2
        if ($scope.imgServerUrl) {
            request.req.imgfiled = $scope.imgServerUrl;
            request.req.isFile = false;
        }

        var file = new FormData(document.forms.namedItem("userForm"));
        file.append('reqArray', JSON.stringify(request));
        console.log(file);
        //if there is an image- show the loader
        //if ($scope.imgurl) {
        //    $scope.showLoader = true;
        //}

        server.request(file)
        .then(function (data) {
            $scope.showLoader = false;
            console.log(data);
            //if success- go to group page
            if (!data.res.error) {
                //if its a group travel - go to group page 
                if ($rootScope.isGroupTravel == true) {
                    $state.transitionTo('group');
                }
                else {
                    $rootScope.$broadcast('joinToGroup', {});
                    $scope.transitionByArch($rootScope.isStationArch);

                }
                localStorage.removeItem('userProfile'); //for check if upload image crash
            }
            else {

            }

        },
        function () {

        });
    };

    //For 4.4.2, get image from device.
    $scope.captureImage = function () {
        if (camera) {
            //  $scope.btn_text = 'התמונה עולה..';
            camera.getPicture()
        .then(function (data) {
            $timeout(function () {
                $scope.imgurl = data.imgData;
                $scope.setPreviewImg($scope.imgurl);
                $scope.pictures = [];
                $scope.pictures.push({ uri: $scope.imgurl });
                $timeout(function () {
                    $scope.uploadText = $filter('localizedFilter')('_stillUploading_');
                }, 5000);
                $timeout(function () {
                    $scope.uploadText = $filter('localizedFilter')('_uploadStillInProcess_');
                }, 15000);
                $timeout(function () {
                    $scope.uploadText = $filter('localizedFilter')('_proccessingImage_');
                }, 25000);
                camera.uploadPhoto($scope.pictures, "img", 1)
                .then(function (data) {
                    $scope.imgServerUrl = data[0][0];
                    $scope.btn_text = $filter('localizedFilter')('_signIn_');
                });
            }, 0);
        });
        }
    }

    $scope.email = '';
    $scope.groupCode = '';
    $scope.groupData = {};
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
    };

    $scope.uploadText = $filter('localizedFilter')('_uploading_');
    $scope.uploadImg = '';

    //$scope.captureImage = function (photoClicked) {
    //    camera.captureImage(photoClicked)
    //            .then(function (data) {
    //                $timeout(function () {
    //                    //get the pictures from camera service
    //                    $scope.pictures = camera.getPictures();
    //                    $scope.imageChosen($scope.pictures['photoCenter']);
    //                }, 0);
    //            });
    //}




    $scope.imageChosen = function (picture) {
        //  if (input.files && input.files[0]) {
        $scope.imgurl = window.URL.createObjectURL(picture.uri);
        //  $scope.imgurl =picture.uri// window.URL.createObjectURL(picture);
        $scope.setPreviewImg($scope.imgurl);
        // $scope.btn_text = 'התמונה עולה';
        $scope.pictures = {};
        $scope.pictures[0] = { uri: $scope.imgurl };

        $scope.pictures[0]['fd'] = new FormData(document.forms.namedItem('userForm'));
        camera.uploadPhotoFormData($scope.pictures, "img", 1)
                .then(function (data) {
                    $scope.imgServerUrl = data[0][0];

                });
        $scope.btn_text = $filter('localizedFilter')('_signUp_');
        //}
    };
    //set the preview image after the user chose an image
    $scope.showPreviewSrc = false;
    $scope.setPreviewImg = function (src) {


        $timeout(function () {
            $scope.showPreviewSrc = true;
            $scope.previewSrc = src;
        }, 0);

    };

    $scope.isApp = isApp();

    //for check if upload image crash
    if (localStorage.getItem('userProfile') == 'start') {
        $rootScope.$broadcast('displayGeneralPopup', { generalPopupText: $filter('localizedFilter')('_signUp_')});
        $rootScope.generalPopupArgs = { generalPopupText: $filter('localizedFilter')('_tip_') + $filter('localizedFilter')('_uploadImageTip_'), generalPopupEvent: true };
        //alert('אם לא הצלחתם לצלם תמונה, נסו להעלות תמונה מהגלריה');
    }

    $scope.clickOnImage = function () {
        if (localStorage.getItem('userProfile') == 'start') {
            //localStorage.removeItem('startMission' + scope.task.mid);
        }
        else {
            localStorage.setItem('userProfile', 'start');
        }
    };

    $scope.transitionByArch = function (data) {
        //if the day is NOT a staging day -go to stages
        if (data == false) {
            $state.transitionTo('mainNav');
        }
        //if the day is a staging day -go to stages
        else if (data == true || parseInt(data.res.isStationArch)) {
            $rootScope.isStationArch = true;
            $state.transitionTo('stages');
        }

        //else - go to mainNav
        else {
            $state.transitionTo('mainNav');
        }

    };

    //if there is homepage - send the group codetoserver
    $scope.sendGroupCode = function () {
        if ($scope.groupData.onlyGroupCode && $scope.groupData.onlyGroupCode.length == 6) {
            $scope.groupCodeNotValid = false;
        }
        else {
            $scope.groupCodeNotValid = true;
            return;
        }

        request = {
            type: "loginToGroup",
            req: {
                cid: cid,
                groupCode: $scope.groupData.onlyGroupCode
            }
        };

        server.request(request)
        .then(function (data) {
            console.log(data);
            //if there is gruop code
            if (data.res.email) {
                //if there is a group travel - and there is no subgroup name - go to subgroup page 
                if (!parseInt(data.res.isSuperActivitySingle) && data.res.subgroup == null) {
                    $state.transitionTo('group');
                }
                else {
                    $rootScope.$broadcast('userSignIn', {});
                    $scope.transitionByArch(data)
                }

            }
            //else - show the error message
            else {
                $timeout(function () {
                    $scope.loginError = true;
                    $scope.loginErrorMsg = $filter('localizedFilter')('_noGroupCode_');
                }, 0);
            }
        });
    };

} ]);