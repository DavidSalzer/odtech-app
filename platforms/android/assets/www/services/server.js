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


            }).
            error(function (err) {
                $rootScope.$broadcast('networkFail', {});
                $timeout(function () {
                    self.request(data).then(function (json) { deferred.resolve(json); });
                }, 5000)

            });
            return deferred.promise;
        },

        //get data from localStorage
        getStorage: function (data) {
            self = this;

            switch (data.type) {
                case 'getActivitiesOfAppUserTwo':
                    ans = self.getStagesListFromStorage();
                    break;
                case 'appUserGetGroup':
                    ans = self.getMissionsListFromStorage();
                    break;
                case 'getMissionsOfActivity':
                    ans = self.getMissionsListFromStorage(data.req);
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
                case 'getActivitiesOfAppUserTwo':
                    self.saveStagesListInStorage(response);
                    break;
                case 'appUserGetGroup':
                    self.saveMissionsListInStorage(response);
                    break;
                case 'getMissionsOfActivity':
                    self.saveMissionsListInStorage(response, data.req);
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
        saveMissionsListInStorage: function (data, req) {
            //set the missions

            //if its a stages template - save by aid
            if ($rootScope.isStationArch) {
                localStorage.setItem('missionsList' + req.aid, JSON.stringify(data));
            }
            else {
                localStorage.setItem('missionsList', JSON.stringify(data));
            }

        },
        //save missions list in localStorage
        saveStagesListInStorage: function (data) {
            localStorage.setItem('stagesList', JSON.stringify(data));
        },
        getStagesListFromStorage: function () {
            stages = JSON.parse(localStorage.getItem('stagesList'));
            if (!stages || stages == null) {
                return false;
            }
            return stages;
        },
        //get missions list from localStorage, if exist
        getMissionsListFromStorage: function (req) {

            //if its a stages template - save by aid
            if ($rootScope.isStationArch) {
                missions = JSON.parse(localStorage.getItem('missionsList' + req.aid))
            }
            else {
                missions = JSON.parse(localStorage.getItem('missionsList'));
            }



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
            if (!mission || mission == null || !mission.res) {
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
            var missionArray = [];
            var isLinear = false;
            var missions = [];
            //if its a stages template
            if ($rootScope.isStationArch) {

                missions = JSON.parse(localStorage.getItem('missionsList' + $rootScope.currentStage));
                if (missions) {
                    missionArray = missions.res.mission;
                    isLinear = missions.res.isLinear;
                }

            }
            else {
                missions = JSON.parse(localStorage.getItem('missionsList'));
                if (missions.res.activitie && missions.res.activitie.mission) { //if success - there is missions

                    isLinear = missions.res.activitie.isLinear;

                    missionArray = missions.res.activitie.mission;
                }
            }




            for (var i = 0; i < missionArray.length; i++) {
                //set the mission data in storage
                if (missionArray[i].mid == data.req.mid) {
                    missionArray[i].status = 'answer';
                    if (isLinear == true) {
                        //if there is more missions - set the next mission to notAnswer
                        if (missionArray[i + 1]) {
                            missionArray[i + 1].status = 'notAnswer';
                        }

                    }
                    missionArray[i].answer = {};
                    //set the answer in storage
                    missionArray[i].answer.data = data.req.data.answer;
                    //set the points in storage
                    missionArray[i].answer.points = data.req.data.points;



                    break;
                }
            }
            if ($rootScope.isStationArch) {
                missions.res.mission = missionArray;

            }
            else {

                missions.res.activitie.mission = missionArray;

            }
            //if its a stages template - save by aid
            if ($rootScope.isStationArch) {
                localStorage.setItem('missionsList' + $rootScope.currentStage, JSON.stringify(missions));
            }
            else {
                localStorage.setItem('missionsList', JSON.stringify(missions));
            }



            //if its a stages template
            //change status on stages list
            if ($rootScope.isStationArch) {
                stages = JSON.parse(localStorage.getItem('stagesList'));
                for (var i = 0; i < stages.res.activities.length; i++) {
                    //if the stage is the current active stage - its status is done ("2")
                    if (stages.res.activities[i].aid == $rootScope.currentStage) {
                        stages.res.activities[i].stationStatus = "answer";
                    }
                }
                localStorage.setItem('stagesList', JSON.stringify(stages));
            }

        },


        clearMissionsInStorage: function () {
            
            var pushKey = localStorage.getItem("pushToken")
            localStorage.clear();
            $rootScope.missionsDetailsInit = undefined;
            //save the pushkey on storage
            localStorage.setItem("pushToken", pushKey);
            //in logout - throw broadcast - for update relevant data by controllers/directives
            $rootScope.initDataInLogout()
        }

    }
} ]);