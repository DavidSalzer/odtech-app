odtechApp.factory('missions', ['server', function ( server) {

    return {
        //return tasks array of mission
        getMissions: function () {

            return server.request({ "type": "getMissionOfActivitie", "req": { "aid": "2"} });


        },
        //return task
        getMissionById: function (mid) {
            return server.request({"type":"getMission","req":{"mid":mid}});
        }

        //לדעת האם המשימה כבר בוצעה או לא
    }
} ]);