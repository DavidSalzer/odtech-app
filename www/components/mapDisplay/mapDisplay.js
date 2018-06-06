odtechApp.controller('mapDisplay', [
  '$rootScope',
  '$scope',
  '$state',
  'missions',
  '$timeout',
  'server',
  function($rootScope, $scope, $state, missions, $timeout, server) {
    $scope.showLive = true;
    $scope.showLoadStripe = false;
    var markers = [];
    //add markers to map
    $scope.addMarkers = function(data, callback) {
      function onMarkerAdded(marker) {
        markers.push(marker);
        if (markers.length === data.length) {
          callback(markers);
        }
      }
      data.forEach(function(markerOptions, index) {
        var icon =
          markerOptions.stationStatus == 0
            ? $rootScope.imgDomain + 'site/img/' + (index * 1 + 1) + '.png'
            : $rootScope.imgDomain + 'site/img/mapDisPointDone.png';
        if (markerOptions && markerOptions.data) {
          $rootScope.map.addMarker(
            {
              position: new plugin.google.maps.LatLng(
                markerOptions.data.latitude,
                markerOptions.data.longitude
              ),
              icon: {
                url: icon
              },
              styles: {
                color: 'red'
              }
            },
            function(marker) {
              marker.addEventListener(
                plugin.google.maps.event.MARKER_CLICK,
                function() {
                  //marker.showInfoWindow();
                  $scope.placeMarker(markerOptions);
                }
              );
            }
          );
        }
      });
    };

    $scope.onMapLoaded = function() {
      console.log('MAP IS loaded event?');
      $rootScope.map.setClickable($scope.showLive);
      //add markers. this way is important because of the ansychronalize between js and native
      $scope.addMarkers($scope.stages, function(markers) {});
      $scope.showLoadStripe = false;
    };
    $scope.showLoadStripe = true;
    //get the markers data - stages
    server
      .request({ type: 'getActivitiesOfAppUserTwo', req: {} })
      .then(function(data) {
        $scope.stages = data.res.activities;
        //set the index for pins' numbers
        for (var i = 0; i < $scope.stages.length; i++) {
          $scope.stages[i].index = i;
        }
        //set the center point - get the middle point. if there is no data- take another
        $scope.centerLatLng = -1;
        //set the middle point
        var stagesIndex = Math.floor($scope.stages.length / 2);
        //pass over the array and get the first poiint, from the middle, that has lang & lat
        while ($scope.centerLatLng == -1 && $scope.stages[stagesIndex]) {
          //if the point has lang & lat - set the centerLatLng variable
          if (
            $scope.stages[stagesIndex] &&
            $scope.stages[stagesIndex].data &&
            $scope.stages[stagesIndex].data.latitude &&
            $scope.stages[stagesIndex].data.longitude
          ) {
            $scope.centerLatLng = new plugin.google.maps.LatLng(
              $scope.stages[stagesIndex].data.latitude,
              $scope.stages[stagesIndex].data.longitude
            );
          } else {
            stagesIndex++;
          }
        }
        //if there is no lang & lat point
        if ($scope.centerLatLng == -1) {
          stagesIndex = 0;
          while (
            $scope.centerLatLng == -1 &&
            $scope.stages[stagesIndex] &&
            stagesIndex < Math.floor($scope.stages.length / 2)
          ) {
            //if the point has lang & lat - set the centerLatLng variable
            if (
              $scope.stages[stagesIndex] &&
              $scope.stages[stagesIndex].data &&
              $scope.stages[stagesIndex].data.latitude &&
              $scope.stages[stagesIndex].data.longitude
            ) {
              $scope.centerLatLng = new plugin.google.maps.LatLng(
                $scope.stages[stagesIndex].data.latitude,
                $scope.stages[stagesIndex].data.longitude
              );
            } else {
              stagesIndex++;
            }
          }
        }

        /*** init the map ***/
        var myOptions = {
          backgroundColor: 'white',
          mapType: plugin.google.maps.MapTypeId.ROADMAP,

          camera: {
            latLng: $scope.centerLatLng,
            zoom: $.browser.isSmartphone ? 17 : 19
          }
        };
        $rootScope.map = plugin.google.maps.Map.getMap(
          document.getElementById('map_canvas'),
          myOptions
        );

        // Initialize the map plugin
        // You have to wait the MAP_READY event.
        $rootScope.map.on(
          plugin.google.maps.event.MAP_READY,
          $scope.onMapLoaded
        );
      });

    //go to stage by marker click
    $scope.placeMarker = function(stageData) {
      $rootScope.currentStageData = stageData;
      $state.transitionTo('mainNav', { stageId: stageData.aid });
    };

    $scope.$on('menuClosed', function(event, data) {
      $state.transitionTo(
        $state.current,
        {},
        {
          reload: true
        }
      );
    });

    //whenb menu opened or closed
    $scope.$on('toggleMenu', function(event, data) {
      //if the menu open
      if (data.isShow == true) {
        $timeout(function() {
          $rootScope.map.setClickable(false);
          $scope.showLive = false;
        }, 0);
      } else {
        $timeout(function() {
          $rootScope.map.setClickable(true);
          $scope.showLive = true;
        }, 0);
      }
    });
  }
]);
