odtechApp.factory('missions', ['$rootScope', '$stateParams', 'server', function ($rootScope, $stateParams, server) {

      return {

        getMissions: function () {
                        
            return server.request({ "type": "getMissionOfActivitie", "req": { "aid": "2"} });
            

        }
    }
} ]);