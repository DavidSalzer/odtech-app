odtechApp.factory('server', ['$rootScope', '$http', '$q', '$state', function ($rootScope, $http, $q, $state) {


    return {

        request: function (data) {

            self = this; //for functions of localStorage

            var deferred = $q.defer();

            //var resFromStorage = self.getStorage(data);

            //if (resFromStorage) {
            //    deferred.resolve(resFromStorage);
            //    return deferred.promise;
            //}

            var httpDetails = {
                url: domain,
                method: "POST",
                data: data,
                contentType: "application/json"
            };

            if (!data.req) {//if it form data
                httpDetails.transformRequest = angular.identity;
                httpDetails.headers = { 'Content-Type': undefined };
                httpDetails.contentType = undefined;
            }

            $http(httpDetails).
            success(function (json) {
                //if user no login, go to login page
                if (json.res && json.res.error == 'not appUser login') {
                    $state.transitionTo('login');
                }
                //set response to localStorage if necessary
                // self.setStorage(data, json);
                deferred.resolve(json);
                //console.log(json);
            }).
            error(function (data) {
                deferred.reject(data);
                //console.log(data);
            });

            return deferred.promise;
        },

        //get data from localStorage
        getStorage: function (data) {
            self = this;

            switch (data.type) {
                case 'appUserGetGroup':
                    ans = self.getMissionsListFromStorage();
                    break;
                case 'appGetMission':
                    ans = self.getMissionFromStorage(data);
                    break;
                case 'sendAnswer':
                    self.setAnsInStorage(data);
                    ans = false;
                    break;
                case 'appUserLogin':
                    self.clearMissionsInStorage();
                    ans = false;
                    break;
                case 'appUserLogout':
                    self.clearMissionsInStorage();
                    ans = false;
                    break;
                default:
                    ans = false;
            }

            return ans;
        },

        //set data to localStorage
        setStorage: function (data, response) {
            self = this;

            switch (data.type) {
                case 'appUserGetGroup':
                    self.saveMissionsListInStorage(response);
                    break;
                case 'appGetMission':
                    self.saveMissionInStorage(response);
                    break;
                case 'sendAnswer':
                    //self.setAnsInStorage(data);
                    break;
            }
        },

        //save missions list in localStorage
        saveMissionsListInStorage: function (data) {
            localStorage.setItem('missionsList', JSON.stringify(data));
        },

        //get missions list from localStorage, if exist
        getMissionsListFromStorage: function () {
            missions = JSON.parse(localStorage.getItem('missionsList'));
            if (!missions || missions == null) {
                return false;
            }
            return missions;
        },

        //save mission localStorage
        saveMissionInStorage: function (data) {
            item = 'mid' + data.res.mid;
            localStorage.setItem(item, JSON.stringify(data));
        },

        //get mission from localStorage, if exist
        getMissionFromStorage: function (data) {
            item = 'mid' + data.req.mid;
            mission = JSON.parse(localStorage.getItem(item));
            if (!mission || mission == null) {
                return false;
            }
            return mission;
        },

        //save answer in localStorage
        setAnsInStorage: function (data) {
            //set answer in mission object
            item = 'mid' + data.req.mid;
            itemObject = JSON.parse(localStorage.getItem(item));
            itemObject.res.status = 'answer';
            itemObject.res.answer = {};
            itemObject.res.answer.data = data.req.data.answer;
            localStorage.setItem(item, JSON.stringify(itemObject));

            //change status of mission in mission list
            missions = JSON.parse(localStorage.getItem('missionsList'));
            for (var i = 0; i < missions.res.activitie.mission.length; i++) {
                if (missions.res.activitie.mission[i].mid == data.req.mid) {
                    missions.res.activitie.mission[i].status = 'answer';
                    if (missions.res.activitie.isLinear) {
                        missions.res.activitie.mission[i + 1].status = 'notAnswer';
                    }
                    //set the answer in storage
                    missions.res.activitie.mission[i].answer = data.req.data.answer;
                    break;
                }
            }
            localStorage.setItem('missionsList', JSON.stringify(missions));
        },

        clearMissionsInStorage: function () {
            localStorage.clear();
        }
    }
} ]);