odtechApp.controller('login', ['$rootScope', '$scope', '$state', 'server', '$timeout', function ($rootScope, $scope, $state, server, $timeout) {

    $scope.appName = 'מסע ישראלי';
    $scope.loginFirstPage = true;

    //general error need to pass to global file.
    $scope.errorMsg = {};
    $scope.errorMsg.generalError = 'אירעה שגיאה, בדקו חיבור לאינטרנט או נסו שנית';

    $scope.sendLogin = function () {
        if (!$scope.loginForm.emailBox.$valid || !$scope.loginForm.code.$valid) {
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
            if (!data.res.error) {
                if (data.res.name) {
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

    $scope.sendUsername = function () {
        if (!$scope.userForm.nickName.$valid) {
            return;
        }

        request = {
            type: "updateAppUser",
            req: {
                name: $scope.userName,
                imgUrl: ''
            }
        }

        server.request(request)
        .then(function (data) {
            console.log(data);
            if (!data.res.error) {
                $state.transitionTo('mainNav');
            }
            else {

            }

        },
        function () {

        })
    }

} ]);