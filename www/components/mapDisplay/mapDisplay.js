odtechApp.controller('mapDisplay', ['$rootScope', '$scope', '$state', 'missions', '$timeout', 'server', function ($rootScope, $scope, $state, missions, $timeout, server) {
    map != undefined ? map.clear() : '';
    map != undefined ? map.off() : '';

    $scope.showLive = true;
    $scope.showLoadStripe = false;
    var markers = [];
    //add markers to map
    $scope.addMarkers = function (data, callback) {

        function onMarkerAdded(marker) {
            markers.push(marker);
            if (markers.length === data.length) {
                callback(markers);
            }
        }
        data.forEach(function (markerOptions, index) {
            var icon = markerOptions.stationStatus == 0 ? $rootScope.imgDomain + 'site/img/' + (index * 1 + 1) + '.png' : $rootScope.imgDomain + 'site/img/mapDisPointDone.png';
            if (markerOptions && markerOptions.data) {
                map.addMarker({
                    'position': new plugin.google.maps.LatLng(markerOptions.data.latitude, markerOptions.data.longitude),
                    //'title': "Hello",
                    'icon': {
                        url: icon
                    },
                    'styles': {
                        'color': 'red'
                    }
                }, function (marker) {
                    marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
                        //marker.showInfoWindow();
                        $scope.placeMarker(markerOptions)
                    });






                });
            }

        });
    }

    //in map loaded event -set the map options
    $scope.onMapLoaded = function () {



        //set map options
        map.setOptions({
            'backgroundColor': 'white',
            'mapType': plugin.google.maps.MapTypeId.ROADMAP,
            'controls': {
                'myLocationButton': true
            },
            'camera': {
                'latLng': $scope.centerLatLng,
                'zoom': $.browser.isSmartphone ? 17 : 19

            }
        });
        //add markers. this way is important because of the ansychronalize between js and native
        $scope.addMarkers($scope.stages, function (markers) {
        });




    }
    $scope.showLoadStripe = true;
    //get the markers data - stages
    server.request({ "type": "getActivitiesOfAppUserTwo", "req": {} })
                                    .then(function (data) {


                                        $scope.stages = data.res.activities;
                                        //set the index for pins' numbers
                                        for (var i = 0; i < $scope.stages.length; i++) {
                                            $scope.stages[i].index = i
                                        }
                                        //set the center point - get the middle point. if there is no data- take another
                                        $scope.centerLatLng = -1;
                                        //set the middle point
                                        var stagesIndex = Math.floor($scope.stages.length / 2);
                                        //pass over the array and get the first poiint, from the middle, that has lang & lat
                                        while ($scope.centerLatLng == -1 && $scope.stages[stagesIndex]) {
                                            //if the point has lang & lat - set the centerLatLng variable
                                            if ($scope.stages[stagesIndex] && $scope.stages[stagesIndex].data && $scope.stages[stagesIndex].data.latitude && $scope.stages[stagesIndex].data.longitude) {
                                                $scope.centerLatLng = new plugin.google.maps.LatLng($scope.stages[stagesIndex].data.latitude, $scope.stages[stagesIndex].data.longitude);
                                            }
                                            else {
                                                stagesIndex++;
                                            }
                                        }
                                        //if there is no lang & lat point
                                        if ($scope.centerLatLng == -1) {
                                            stagesIndex = 0
                                            while ($scope.centerLatLng == -1 && $scope.stages[stagesIndex] && stagesIndex < Math.floor($scope.stages.length / 2)) {
                                                //if the point has lang & lat - set the centerLatLng variable
                                                if ($scope.stages[stagesIndex] && $scope.stages[stagesIndex].data && $scope.stages[stagesIndex].data.latitude && $scope.stages[stagesIndex].data.longitude) {
                                                    $scope.centerLatLng = new plugin.google.maps.LatLng($scope.stages[stagesIndex].data.latitude, $scope.stages[stagesIndex].data.longitude);
                                                }
                                                else {
                                                    stagesIndex++;
                                                }
                                            }
                                        }


                                        /*** init the map ***/
                                        var mapDiv = document.getElementById("map_canvas");
                                        // Initialize the map plugin
                                        map = plugin.google.maps.Map.getMap(mapDiv);
                                        // You have to wait the MAP_READY event.
                                        map.on(plugin.google.maps.event.MAP_READY, $scope.onMapLoaded);
                                        map.on(plugin.google.maps.event.CAMERA_IDLE, function () {

                                            $scope.showLoadStripe = false;
                                        })
                                        map.on(plugin.google.maps.event.MAP_LOADED, function () {

                                            $scope.showLoadStripe = false;
                                        })

                                    })


    //go to stage by marker click
    $scope.placeMarker = function (stageData) {
        $rootScope.currentStageData = stageData;
        $state.transitionTo('mainNav', { stageId: stageData.aid });
    }

    //whenb menu opened or closed
    $scope.$on('toggleMenu', function (event, data) {
        //if the menu open
        if (data.isShow == true) {
            //replace the map to image and hide the map
            map.toDataURL(function (imageData) {
                var image = document.getElementById("map_static");

                image.src = imageData;
                $timeout(function () {
                    $scope.showLive = false;
                }, 0)
                //$("#map_canvas").hide();
                //$("#map_static").show();

            });
        }
        else {

            $timeout(function () {
                $scope.showLive = true;
            }, 0)



            //$("#map_canvas").show();
            //$("#map_static").hide();
        }
    });



} ]);
var map;