odtechApp.controller('login', ['$rootScope', '$scope', '$state', 'server', '$timeout', 'camera', function ($rootScope, $scope, $state, server, $timeout, camera) {
    $scope.loginFirstPage = true;
    $scope.userName = '';
    $scope.btn_text = 'הירשם';
    //set the state - for hide and show the footer
    // $scope.$state = $state;

    $rootScope.$broadcast('stopLocationWatcher', {});

    //check if the user login
    server.request({ "type": "getAppUser", "req": {} })
    .then(function (data) {
        //if user login
        if (data.res && data.res.name) {
            $rootScope.showDescription = true; //show day description in mainNav.
            
             console.log('mainNav 4')
            $state.transitionTo('mainNav');
           
            $rootScope.$broadcast('showDescription', {});
        }
        //if logged in user has no userName 
        else if (data.res && data.res.email) {
            $timeout(function () {
                $scope.loginFirstPage = false;
            }, 0)
        }
        //if the user logout
        else {
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
                //if it old user go to groups page else update user details. 
                if (data.res.name) {
                    $rootScope.showDescription = true; //show day description in mainNav.
                      
                    $state.transitionTo('mainNav');
                    console.log('mainNav 6')
                 //   $rootScope.$broadcast('showDescription', {});

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

        $("input").blur();
    }
    $scope.showLoader = false;

    //Send user details (userName and image) to server.
    $scope.sendUsername = function () {
        if (!$scope.imgServerUrl && $scope.imgurl) {
            return;
        }
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
        //if there is an image- show the loader
        if ($scope.imgurl) {
            $scope.showLoader = true;
        }

        server.request(file)
        .then(function (data) {
            $scope.showLoader = false;
            console.log(data);
            //if success- go to group page
            if (!data.res.error) {
                // alert(1);
                localStorage.removeItem('userProfile'); //for check if upload image crash
                $state.transitionTo('group');

            }
            else {

            }

        },
        function () {

        })
    }

    //For 4.4.2, get image from device.
    $scope.captureImage = function () {
        if (camera) {
            $scope.btn_text = 'התמונה עולה..';
            camera.getPicture()
        .then(function (data) {
            $timeout(function () {
                $scope.imgurl = data.imgData;
                $scope.setPreviewImg($scope.imgurl);
                $scope.pictures = [];
                $scope.pictures.push({ uri: $scope.imgurl });
                $timeout(function () {
                    $scope.uploadText = "ממשיך בהעלאה..";
                }, 5000);
                $timeout(function () {
                    $scope.uploadText = "ההעלאה נמשכת..";
                }, 15000);
                $timeout(function () {
                    $scope.uploadText = "התמונה שלך אכותית, ההעלאה תמשך עוד כמה שניות..";
                }, 25000);
                camera.uploadPhoto($scope.pictures, "img", 1)
                .then(function (data) {
                    $scope.imgServerUrl = data[0][0];
                    $scope.btn_text = 'הירשם';
                });
            }, 0);
        });
        }
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

    $scope.uploadText = "בהעלאה..";
    $scope.uploadImg = '';
    $scope.imageChosen = function (input) {
        if (input.files && input.files[0]) {
            /*var reader = new FileReader();

            reader.onload = function (e) {
            //set the preview image
            $scope.setPreviewImg(e.target.result);
            // $('#blah').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
            */
            $scope.imgurl = window.URL.createObjectURL(input.files[0]);
            $scope.setPreviewImg($scope.imgurl);
            $scope.btn_text = 'התמונה עולה';
            $scope.pictures = {};
            $scope.pictures[0] = { uri: $scope.imgurl };

            $timeout(function () {
                $scope.uploadText = "ממשיך בהעלאה..";
            }, 5000);
            $timeout(function () {
                $scope.uploadText = "ההעלאה נמשכת..";
            }, 15000);
            $timeout(function () {
                $scope.uploadText = "התמונה שלך אכותית, ההעלאה תמשך עוד כמה שניות..";
            }, 25000);
            $scope.pictures[0]['fd'] = new FormData(document.forms.namedItem('userForm'));
            camera.uploadPhotoFormData($scope.pictures, "img", 1)
                .then(function (data) {
                    $scope.imgServerUrl = data[0][0];
                    $scope.btn_text = 'הירשם';
                });
        }
    }
    //set the preview image after the user chose an image
    $scope.showPreviewSrc = false;
    $scope.setPreviewImg = function (src) {


        $timeout(function () {
            $scope.showPreviewSrc = true;
            $scope.previewSrc = src;
        }, 0)

    }

    $scope.isApp = isApp();

    //for check if upload image crash
    if (localStorage.getItem('userProfile') == 'start') {
        $rootScope.$broadcast('displayGeneralPopup', { generalPopupText: 'אם לא הצלחתם לצלם תמונה, נסו להעלות תמונה מהגלריה' });
        $rootScope.generalPopupArgs = {generalPopupText: 'טיפ: אם לא הצלחתם לצלם תמונה, נסו להעלות תמונה מהגלריה', generalPopupEvent: true}
        //alert('אם לא הצלחתם לצלם תמונה, נסו להעלות תמונה מהגלריה');
    }

    $scope.clickOnImage = function () {
        if (localStorage.getItem('userProfile') == 'start') {
            //localStorage.removeItem('startMission' + scope.task.mid);
        }
        else {
            localStorage.setItem('userProfile', 'start');
        }
    }
} ]);