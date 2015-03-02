odtechApp.factory('missions', ['server', function ( server) {

    return {
        //return tasks array of mission
        getMissions: function () {

            return server.request({ "type": "appUserGetGroup", "req": {} });


        },
        //return task
        getMissionById: function (mid) {
            return server.request({"type":"appGetMission","req":{"mid":mid}});
        }

        //לדעת האם המשימה כבר בוצעה או לא
    }
} ]);