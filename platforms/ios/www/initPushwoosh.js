if (allowPushWoosh) {

    var pushNotification;

    function stopPushwoosh() {
        //  alert('stop notification');
        //register for pushes
        pushNotification.unregisterDevice(
				function (status) {
				    var pushToken = status;
				    console.warn('push token: ' + pushToken);
				},
				function (status) {
				    console.warn(JSON.stringify(['failed to register ', status]));
				}
		);
    }

    function initPushwoosh() {

        //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
        if (isAndroid) {
            pushNotification.onDeviceReady({ projectid: projectId, appid: appId });
            savePushData()
        }
        if (isIOS || isIPad) {
            pushNotification.onDeviceReady({ pw_appid: appId });
        }
        //register for pushes
        pushNotification.registerDevice(
				function (status) {

				    var pushToken;
				    if (isAndroid) {
				        pushToken = status;

				    }
				    if (isIOS || isIPad) {
				        pushToken = status.deviceToken;
				    }
				    localStorage.setItem("pushToken", pushToken);
				    //alert('success');
				    console.log('push token: ' + pushToken);
				},
				function (status) {
				    //alert('error');
				    localStorage.setItem("pushToken", 'none');
				    console.warn(JSON.stringify(['failed to register ', status]));
				}
		);
    }


    document.addEventListener("deviceready", onDeviceReadyForPush, true);

    function onDeviceReadyForPush() {
        pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");
        // if (localStorage.notifications == undefined) { localStorage.notifications = 1;
        initPushwoosh();
        //  }
    }

    function savePushData() {
        pushNotification.getLaunchNotification(function (pushHistory) {
            console.log('pushHistory')
            console.log(pushHistory)
        });

    }






}