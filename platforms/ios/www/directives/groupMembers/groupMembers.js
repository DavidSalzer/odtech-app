odtechApp.directive('groupMembers', ['server', '$state', '$timeout', '$rootScope', function (server, $state, $timeout, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: './directives/groupMembers/groupMembers.html',
        link: function (scope, el, attrs) {
            //set the state - for hide and show the profile
            scope.$state = $state;

            scope.imgDomain = imgDomain;
           // $rootScope.user = {}
            console.log('33')
            scope.showMembers = false;
            scope.getUser = function (callback) {
                console.log(' scope.getUser')
                server.request({ "type": "getAppUser", "req": {} })
                .then(function (data) {
                    if (data.res != null) {
                        if (parseInt(data.res.isStationArch)) {
                            $rootScope.isStationArch = true;
                        }
                        $rootScope.user = data.res;
                        console.log('44')
                        if (callback) {
                            callback.call();
                        }

                    }
                    else {
                        $state.transitionTo('login');
                    }

                })

            }
            //click on members window
            scope.openDataMembers = function () {
                if (!jQuery.isEmptyObject(scope.groupMembers)) {
                    //open the members window
                    scope.showMembers = !scope.showMembers;
                }

                //get the members 
                scope.getMembers();


            }
            scope.getMembers = function () {
                //get the members - need the group name
                server.request({ "type": "getCurrUserSGMembers", "req": { "subgroup": scope.user.subgroup} })
            .then(function (data) {
                // display the memebres names
                scope.groupMembers = data.res;

            })


            }
            //init the group members - by user data
            scope.initGroupMembers = function () {
                scope.getUser(scope.getMembers);
            }
            scope.initGroupMembers();
            //after the user join to a group - init the members on profile section
            scope.$on('joinToGroup', function () {
                scope.initGroupMembers()
            });
            scope.$on('userSignIn', function () {
                scope.initGroupMembers()
            });

        },
        replace: true
    };

} ]);

