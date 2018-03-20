odtechApp.controller('pushMessages', ['$scope', '$rootScope', '$timeout','server', function ($scope, $rootScope, $timeout,server) {
    $scope.messagesList = [];
    //$scope.messagesList = [{ "title": "only one device", "collapse_key": "do_not_collapse", "pw_msg": "1", "android.support.content.wakelockid": 2, "l": "http://goo.gl/UTpam", "from": "214536251304", "onStart": true, "foreground": false },
    //{ "title": "only one device", "collapse_key": "do_not_collapse", "pw_msg": "1", "android.support.content.wakelockid": 3, "l": "http://goo.gl/UTpam", "from": "214536251304", "onStart": false, "foreground": true },
    //{ "title": "sleep", "collapse_key": "do_not_collapse", "pw_msg": "1", "android.support.content.wakelockid": 4, "l": "http://goo.gl/UTpam", "from": "214536251304", "onStart": true, "foreground": false}]

//    res: [{pmid:8, auid:2438, time:1446712239689, message:בלה לבה},…]
//0: {pmid:8, auid:2438, time:1446712239689, message:בלה לבה}
//auid: "2438"
//message: "בלה לבה"
//pmid: "8"
//time: "1446712239689"


    $scope.initList = function () {
        if (allowPushWoosh) {
            request = {
                type: "getAllPushMassage",
                req: {

                }
            }

            server.request(request)
        .then(function (data) {
           $scope.messagesList =data.res;
        });
        }

    }

    $scope.initList();

    $scope.getDate =function (timestamp){
         return timestamp.getDate();
        
    }
} ]);

