odtechApp.directive('watchVideo', ['$window', function ($window) {
    return {
        restrict: 'E',
        templateUrl: './features/watchVideo/watchVideo.html',
        link: function (scope, el, attrs) {
            /*ver 1.1 include youtubeURL*/
            /*write what the function does.
            write main function
            */
            //youtubeApiReady = false;
            //var tag = document.createElement('script');
            //tag.src = "https://www.youtube.com/player_api";
            //var firstScriptTag = document.getElementsByTagName('script')[0];
            // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            scope.player;
            scope.startYoutube = false;
            var player;
            scope.endMovie = false;


            //init youtube player
            scope.initPlayer = function () {
                if (!scope.youtubeReset) {
                    scope.youtubeReset = true;
                    scope.player = new YT.Player('youtube-url-video', {
                        height: '100%',
                        width: '100%',
                        playerVars: { 'controls': 0 },
                        videoId: scope.task.youtubeID,
                        events: {
                            'onReady': scope.playerReady,
                            'onStateChange': scope.playerStateChange
                        }
                    });
                }
            }

            //init event
            $window.onYouTubeIframeAPIReady = function () {
                scope.initPlayer();
            }
            //youtube player is ready and user allready press on continue
            scope.playerReady = function () {
                if (scope.startYoutube) {
                    scope.player.playVideo();
                }
            }

            //handel event that player is change->need to know when finish
            scope.playerStateChange = function (newState) {
                //if finish
                if (newState.data == 0) {
                    scope.player.seekTo(0);
                    setTimeout(function () {
                        scope.player.pauseVideo();
                    }, 100);
                    $('.fullMovie').addClass('blur');
                    $('.movieCtl').show();
                    scope.endMovie = true;
                }
            }
            // remove blur class and hide video controls
            scope.removeBlur = function () {
                $('.fullMovie').removeClass('blur');
                $('.movieCtl').hide();
            }

            //play video when the missiom start
            scope.$watch('startMission', function (newVal, oldVal) {
                console.log('changed');
                if (newVal == true && oldVal == false) { // the mission start
                    scope.play();
                }
            });

            //update the movie from server
            scope.$watch('task', function (newVal, oldVal) {
                //if youtyube player initialize befor get youtyubeID - update now
                if (scope.task.youtubeID && scope.player) {
                    scope.player.cueVideoByUrl("http://www.youtube.com/v/" + scope.task.youtubeID + "?version=3");
                } else if (scope.task.youtubeID) {
                    scope.initPlayer();
                } else if (scope.task.videoURL) {
                    $("#fullMovie").html('<source src="' + scope.task.videoURL + '" type="video/mp4"></source>');
                }
            });

            //listener for end mov
            document.getElementById('fullMovie').addEventListener('ended', fullMovieHandler, false);
            function fullMovieHandler(e) {
                if (!e) { e = window.event; }
                // What you want to do after the event
                scope.endMovie = true;
                $('.fullMovie').addClass('blur');
                $('.movieCtl').show();

            }

            //play video
            scope.play = function () {
                scope.removeBlur();
                scope.endMovie = false;
                scope.playing = true;
                if (!scope.task.videoURL && scope.task.youtubeID) {
                    scope.player.playVideo();
                    scope.startYoutube = true;
                } else {
                    document.getElementById('fullMovie').play();
                }
            }

            //the mission finished
            scope.stop = function () {
                alert("סימתי");
            }

            //pause video or replay after starting the mission
            scope.pause = function () {
                if (scope.playing) {
                    scope.playing = false;
                    document.getElementById('fullMovie').pause();
                } else {
                    scope.playing = true;
                    document.getElementById('fullMovie').play();
                }
            }

        },
        replace: true
    };
} ]);