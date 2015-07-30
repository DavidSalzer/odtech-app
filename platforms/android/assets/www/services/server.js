odtechApp.factory('server', ['$rootScope', '$http', '$q', '$state', '$timeout', function ($rootScope, $http, $q, $state, $timeout) {


    return {

        request: function (data) {

            self = this; //for functions of localStorage

            var deferred = $q.defer();

            var resFromStorage = self.getStorage(data);

            if (resFromStorage) {
                //if the data is trip summary mission -call to server and not take from storage
                if (resFromStorage.res && resFromStorage.res.type == 'tripSummary') {
                }
                else {
                    deferred.resolve(resFromStorage);
                    return deferred.promise;
                }

            }

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
                $rootScope.$broadcast('hasNetwork', {});
                //if user no login, go to login page
                if (json.res && (json.res.error == 'non permission' || json.res.error == 'not appUser login')) {
                    $state.transitionTo('login');
                }
                //set response to localStorage if necessary
                else {
                    self.setStorage(data, json);
                    deferred.resolve(json);
                }


                //console.log(json);
            }).
            error(function (err) {
                $rootScope.$broadcast('networkFail', {});
                $timeout(function () {
                    self.request(data).then(function (json) { deferred.resolve(json); });
                }, 5000)

                //deferred.reject(data);
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
            //if the mission is sub mission 
            //we have to update the parent mission with the new subMission's status - in subMissionArray
            if (data.req.isRouteMission != "0") {
                parentItem = 'mid' + data.req.isRouteMission;
                parentItemObject = JSON.parse(localStorage.getItem(parentItem));

                //pass over the subMission array - on parent
                //and update the new status
                for (var i = 0; i < parentItemObject.res.subMission.length; i++) {
                    if (parentItemObject.res.subMission[i].mid == data.req.mid) {
                        parentItemObject.res.subMission[i].status = "answer"
                    }
                }
                //update the local storage with the parent data -with the new subMission status
                localStorage.setItem(parentItem, JSON.stringify(parentItemObject));

            }
            //change status of mission in mission list
            missions = JSON.parse(localStorage.getItem('missionsList'));
            for (var i = 0; i < missions.res.activitie.mission.length; i++) {
                //set the mission data in storage
                if (missions.res.activitie.mission[i].mid == data.req.mid) {
                    missions.res.activitie.mission[i].status = 'answer';
                    if (missions.res.activitie.isLinear) {
                        //if there is more missions - set the next mission to notAnswer
                        if (missions.res.activitie.mission[i + 1]) {
                            missions.res.activitie.mission[i + 1].status = 'notAnswer';
                        }

                    }
                    missions.res.activitie.mission[i].answer = {};
                    //set the answer in storage
                    missions.res.activitie.mission[i].answer.data = data.req.data.answer;
                    //set the points in storage
                    missions.res.activitie.mission[i].answer.points = data.req.data.points;



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