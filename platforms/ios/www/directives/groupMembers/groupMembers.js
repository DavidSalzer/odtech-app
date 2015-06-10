odtechApp.directive('groupMembers', ['server', '$state', '$timeout', function (server, $state, $timeout) {
    return {
        restrict: 'E',
        templateUrl: './directives/groupMembers/groupMembers.html',
        link: function (scope, el, attrs) {
            //set the state - for hide and show the profile
            scope.$state = $state;

            scope.imgDomain = imgDomain;
            scope.user = {}
            scope.showMembers = false;
            scope.getUser = function (callback) {

                server.request({ "type": "getAppUser", "req": {} })
                .then(function (data) {
                    if (data.res != null) {
                        scope.user = data.res;

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
                //open the members window
                scope.showMembers = !scope.showMembers;
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

        },
        replace: true
    };

} ]);

