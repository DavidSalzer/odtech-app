odtechApp.controller('userLogin', ['$rootScope', '$scope', '$state', '$http', 'server', '$timeout', 'camera', function ($rootScope, $scope, $state, $http, server, $timeout, camera) {

    $scope.firstLogin = true;
    $scope.showLoginForm = true;
    $scope.cities = []
    $scope.roles = []
    $scope.dates = []
    $scope.institutions = []

    $rootScope.$broadcast('stopLocationWatcher', {});

    $scope.getAppUser = function () {

        server.request({ "type": "getAppUser", "req": {} })
    .then(function (data) {
        //if user login - go to main
        if (data.res && data.res.name) {
            $state.transitionTo('main');

        }
        //if user not login -show the login inputs
        else {
            $scope.firstLogin = true;
        }

    })
    }

    $scope.initInputs = function () {
        var httpDetails = {
            url: imgDomain + 'clientData/' + $rootScope.cid + '/selectors.json',
            method: "GET"
        };
        $http(httpDetails).
            success(function (data) {
                if (data) {
                    $scope.cities = data.cities.values;
                    $scope.dates = data.dates.values
                    $scope.roles = data.roles.values
                    $scope.institutions = data.institutions.values;
                }
            })
            .error(function (json) {
                console.log('error get cities')
            })





    }

    $scope.init = function () {
        //check if the user login
        $scope.getAppUser()
        $scope.initInputs()
    }
    $scope.init();


    $scope.sendLogin = function () {
        //validations
        if (!$scope.loginForm.emailBox.$valid) {
            $scope.mailnotValid = true;
            return;
        }
        //if this is the email data
        if ($scope.firstLogin) {
            $scope.sendEmailLogin()
        }
        else {
            $scope.sendFormLogin()

        }

        $("input").blur();
    }
    $scope.userData;
    //send login only by email
    $scope.sendEmailLogin = function () {
        // console.log('pushkey: ' + localStorage.getItem("pushToken"))
        request = {
            type: "appUserLoginMail",
            req: {
                email: $scope.email,
                cid: cid,
                pushKey: localStorage.getItem("pushToken")
            }
        }

        server.request(request)
        .then(function (data) {
            //if success.
            if (!data.res.error) {
                //if it old user go to main page else update user details
                //go to login form -data.res.isNewUser
                //if its old user- the status is update
                //else -its new user -the status is new user

                $scope.firstLogin = false;
                $scope.userData = data.res;
                if ($scope.userData.isNewUser != true) {
                    //init the models
                    $scope.fullName = $scope.userData.fullName;
                    $scope.phoneNumber = parseInt($scope.userData.phoneNumber);
                    $scope.selectedCity = $scope.userData.city;
                    $scope.selectedRoles = $scope.userData.role;
                    $scope.selectedDates = $scope.userData.dateOfJourney;
                    $scope.selectedInstitutions = $scope.userData.InstitutionName;


                    //  $state.transitionTo('main');
                }
            }


        })
    }
    //send the new login's fields
    $scope.sendFormLogin = function () {
        //if the user fill all the fields - send the data to server
        if ($scope.fullName && $scope.phoneNumber && $scope.phoneNumber.toString().length > 0 && $scope.selectedCity != 'עיר/ישוב' && $scope.selectedRoles != 'תפקיד' && $scope.selectedDates != 'תאריך מסע' && $scope.selectedInstitutions != 'שם מוסד/ארגון') {
            request = {
                type: "updateUserInfo",
                req: {
                    fullName: $scope.fullName,
                    phoneNumber: $scope.phoneNumber,
                    city: $scope.selectedCity,
                    role: $scope.selectedRoles,
                    dateOfJourney: $scope.selectedDates,
                    institutionName: $scope.selectedInstitutions
                }
            }

            server.request(request)
        .then(function (data) {
            console.log(data);
            $state.transitionTo('main');

        })
        }
        else{
            alert('עליך למלא את כל השדות על מנת להתחבר')
        }

    }

    $scope.changeInput = function (type) {

        $scope.mailnotValid = true;
    }
    $scope.showInitLoader = false;
    $scope.initUser = function () {
        $scope.showInitLoader = true;
        server.request({ "type": "appUserRemoveFromGroup", "req": {} })
    .then(function (data) {

        alert("המשתמש אופס!")
         $scope.showInitLoader = false;
    })
    }


} ]);