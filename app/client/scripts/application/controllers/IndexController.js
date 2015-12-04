IndexController = function($scope, socket) {
    var text = Baseball.util.text;
    var Game = Baseball.Game;
    var Animator = Baseball.service.Animator;

    window.s = $scope;
    $scope.t = text;

    $scope.mode = function(setMode) {
        if (setMode) {
            text.mode = setMode;
            if (localStorage) {
                localStorage.__$yakyuuaikoukai_text_mode = setMode;
            }
        }
        return text.mode;
    };

    if (localStorage) {
        var mode = localStorage.__$yakyuuaikoukai_text_mode;
        if (mode === 'e' || mode === 'n') {
            $scope.mode(mode);
        }
    }

    $scope.teamJapan = function() {
        var provider = new Baseball.teams.Provider;
        provider.assignTeam($scope.y, 'TeamJapan', 'away');
        var game = $scope.y;
        if (game.half === 'top') {
            game.batter = game.teams.away.lineup[game.batter.order];
            game.deck = game.teams.away.lineup[(game.batter.order + 1) % 9];
            game.hole = game.teams.away.lineup[(game.batter.order + 2) % 9];
        } else {
            game.pitcher = game.teams.away.positions.pitcher;
        }
    };

    $scope.sim = function() {$scope.proceedToGame(1, 1);};
    $scope.seventh = function() {$scope.proceedToGame(7);};
    $scope.playball = function() {$scope.proceedToGame();};
    $scope.spectate = function() {$scope.proceedToGame(0,1);};

    $scope.proceedToGame = function(quickMode, spectateCpu) {
        $scope.y = new Game();
        var game = $scope.y;
        game.humanControl = spectateCpu ? 'none' : 'home';
        game.quickMode = !!quickMode && quickMode !== 7;
        var field = window.location.hash ? window.location.hash.slice(1) : game.teams.home.name + Math.ceil(Math.random()*47);
        if (typeof io !== 'undefined') {
            socket.game = game;
            $scope.socket = io(/*window.location.hostname*/'http://georgefu.info' + ':64321', {
                reconnection: false
            });
            $scope.socketService = socket;
            socket.socket = $scope.socket;
            socket.start(field);
        }
        window.location.hash = '#' + field;
        s2.y = game;
        bindMethods();
        $('.blocking').remove();
        if (game.humanControl == 'none' && game.quickMode) {
            var n = 0;
            Animator.console = true;
            game.console = true;
            do {
                n++;
                game.simulateInput(function(callback) {
                    typeof callback == 'function' && callback();
                });
            } while (game.stage != 'end' && n < 500);
            Animator.console = game.console = false;
            log('sim ended');
            game.debugOut();
        } else if (game.humanControl == 'none') {
            var scalar = game.quickMode ? 0.05 : 1;
            var auto = setInterval(function() {
                if (game.stage == 'end') {
                    clearInterval(auto);
                }
                game.simulatePitchAndSwing(function(callback) {
                    game.quickMode ? void 0 : $scope.$apply();
                    $scope.updateFlightPath(callback);
                });
            }, scalar*(game.field.hasRunnersOn() ? Animator.TIME_FROM_SET + 2000 : Animator.TIME_FROM_WINDUP + 2000));
        } else if (quickMode === 7 && spectateCpu === undefined) {
            Animator.console = game.quickMode = game.console = true;
            do {
                game.simulateInput(function(callback) {
                    typeof callback == 'function' && callback();
                });
            } while (game.inning < 7);
            log('sim halted in 7th');
            // todo debug 7th inning excess callbacks
            game.debugOut();
            Animator.console = game.quickMode = game.console = false;
            game.stage = 'pitch';
            game.half = 'top';
            game.humanControl = 'home';
        }
        if (game.humanControl == 'away') {
            game.simulateInput(function(callback) {
                $scope.updateFlightPath(callback);
            });
        }
        if (game.humanControl == 'home') {
            $scope.showMessage = true;
        }
        if (!quickMode || quickMode === 7) {
            game.timeOfDay.h = '00';
            var delay = 100,
                interval = 150;
            while (delay < (game.startTime.h - game.timeOfDay.h) * interval) {
                setTimeout(function() {
                    game.passMinutes(60);
                    $scope.$apply();
                }, delay);
                delay += interval;
            }
        }
    };

    var bindMethods = function() {
        var game = $scope.y;
        $scope.holdUpTimeouts = [];
        $scope.expandScoreboard = false;
        $scope.updateFlightPath = Animator.updateFlightPath.bind($scope);

        // avoid scope cycles, any other easy way?
        var bat = $('.target .swing.stance-indicator');
        var showBat = function(event) {
            if (game.humanBatting()) {
                var offset = $('.target').offset();
                var relativeOffset = {
                    x : event.pageX - offset.left,
                    y : 200 - (event.pageY - offset.top)
                };
                var angle = game.setBatAngle(relativeOffset.x, relativeOffset.y);
                bat.css({
                    top: 200-relativeOffset.y + "px",
                    left: relativeOffset.x + "px",
                    transform: "rotate(" + angle + "deg) rotateY("+(game.batter.bats == "left" ? 0 : -0)+"deg)"
                });
                if (relativeOffset.x > 200 || relativeOffset.x < 0 || relativeOffset.y > 200 || relativeOffset.y < 0) {
                    bat.hide();
                } else {
                    bat.show();
                }
            }
        };
        var glove = $('.target .glove.stance-indicator');
        var showGlove = function(event) {
            if (game.humanPitching()) {
                var offset = $('.target').offset();
                var relativeOffset = {
                    x : event.pageX - offset.left,
                    y : 200 - (event.pageY - offset.top)
                };
                glove.css({
                    top: 200-relativeOffset.y + "px",
                    left: relativeOffset.x + "px"
                });
                if (relativeOffset.x > 200 || relativeOffset.x < 0 || relativeOffset.y > 200 || relativeOffset.y < 0) {
                    glove.hide();
                } else {
                    glove.show();
                }
            }
        };

        $scope.clickLineup = function(player) {
            if (player.team.sub) {
                var sub = player.team.sub;
                player.team.sub = null;
                return sub.substitute(player);
            }
            player.team.expanded = (player.team.expanded == player ? null : player);
        };
        $scope.selectSubstitute = function(player) {
            if (game.humanControl === 'home' && player.team !== game.teams.home) return;
            if (game.humanControl === 'away' && player.team !== game.teams.away) return;
            player.team.sub = (player.team.sub === player ? null : player);
        };

        $scope.selectPitch = function(pitchName) {
            if (game.stage == 'pitch') {
                game.pitchInFlight = $.extend({}, game.pitcher.pitching[pitchName]);
                game.pitchInFlight.name = pitchName;
                game.swingResult.looking = true;
            }
        };
        $scope.allowInput = true;
        $scope.holdUp = function() {
            $('.input-area').click();
            $scope.$apply();
        };
        game.startOpponentPitching = function(callback) {
            $scope.updateFlightPath(callback);
        };
        $scope.indicate = function($event) {
            if (!$scope.allowInput) {
                return;
            }
            if (game.pitcher.windingUp) {
                return;
            }
            if (game.humanPitching()) $scope.allowInput = false;
            var offset = $('.target').offset();
            var relativeOffset = {
                x : $event.pageX - offset.left,
                y : 200 - ($event.pageY - offset.top)
            };
            clearTimeout($scope.lastTimeout);
            while ($scope.holdUpTimeouts.length) {
                clearTimeout($scope.holdUpTimeouts.shift());
            }
            $scope.showMessage = false;
            game.receiveInput(relativeOffset.x, relativeOffset.y, function(callback) {
                $scope.updateFlightPath(callback);
            });
        };
        $scope.abbreviatePosition = function(position) {
            if (text.mode == 'e') {
                return {
                    pitcher : 'P',
                    catcher : 'C',
                    first : '1B',
                    second : '2B',
                    short : 'SS',
                    third : '3B',
                    left : 'LF',
                    center : 'CF',
                    right : 'RF'
                }[position];
            }
            return text.fielderShortName(position);
        };
        $scope.$watch('y.humanBatting()', function() {
            if ($scope.y.humanBatting()) {
                $('.input-area').mousemove(showBat);
            } else {
                $('.input-area').unbind('mousemove', showBat);
                bat.hide();
            }
        });
        $scope.$watch('y.humanPitching()', function() {
            if ($scope.y.humanPitching()) {
                $('.input-area').mousemove(showGlove);
            } else {
                $('.input-area').unbind('mousemove', showGlove);
                glove.hide();
            }
        });
        var aside = {
            left: $('aside.image-panel.left'),
            right: $('aside.image-panel.right')
        };
        //$scope.$watch('y.playResult', function() {
        //    aside.left.hide();
        //    aside.right.hide();
        //    aside.left.fadeIn(1000, function() {
        //        aside.left.fadeOut(1000);
        //        aside.right.fadeIn(1000, function() {
        //            aside.right.fadeOut(1000);
        //        })
        //    });
        //    $scope.imagePanel = {
        //        left: 'url(./public/images/' + $scope.y.playResult.batter + '.png)',
        //        right: 'url(./public/images/' + $scope.y.playResult.fielder + '.png)'
        //    };
        //});
    };


};