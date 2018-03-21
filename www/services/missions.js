odtechApp.factory('missions', ['server', '$rootScope', function (server, $rootScope) {

    missionList = {};
    //get all the missions details in the start. - prevent network problem
    //$rootScope.$on('hasTasks', function (event, data) {


    //});
    return {
        //return missions by stageId
        getMissionsOfActivity: function (activityId) {

            return server.request({ "type": "getMissionsOfActivity", "req": { "aid": activityId} });


        },
        //return tasks array of mission
        getMissions: function () {

            return server.request({ "type": "appUserGetGroup", "req": {} });


        },
        //set mission list in service
        setMissions: function (list) {
            missionList = list;
        },

        //check if go to next mission directly, return next mission
        directlyNext: function (mid) {
            //if (!missionList || !missionList.activitie) {
            if (!missionList) {
                return false;
            }
            self = this;
            for (var i in missionList) {
                if (missionList[i].mid == mid) {
                    if (missionList[i].jumpToNext == '1') {
                        var ans = self.getIdByOrder(parseInt(missionList[i].order) + 1);
                        return ans;
                    }
                    else {
                        return false;
                    }
                }
            }
        },

        //get id of mission by order of mission
        getIdByOrder: function (order) {
            if (!missionList) {
                return false;
            }

            for (var i in missionList) {
                if (missionList[i].order == order) {
                    return missionList[i].mid;
                }
            }

            return false;
        },

        //return task
        getMissionById: function (mid) {
            return server.request({ "type": "appGetMission", "req": { "mid": mid} });
        },
        //get all the missions details in the start. - prevent network problem
        preloadMissions: function (data) {
            //do it only one time - not in all enter
            if (!$rootScope.missionsDetailsInit) {
                $rootScope.missionsDetailsInit = true;
                //if its not a station arch - get the missions detail
                if (!$rootScope.isStationArch) {
                    for (var i = 0; i < data.length; i++) {
                        server.request({ "type": "appGetMission", "req": { "mid": data[i].mid} });
                    }

                }
                else {
                    stagesArr = data.res.activities;
                    for (var i = 0; i < stagesArr.length; i++) {
                        this.getMissionsOfActivity(stagesArr[i].aid).then(function (data) {
                            for (var i = 0; i < data.res.mission.length; i++) {
                                server.request({ "type": "appGetMission", "req": { "mid": data.res.mission[i].mid} });
                            }
                        })

                    }
                }
            }
        }

        //לדעת האם המשימה כבר בוצעה או לא
    }


} ]);