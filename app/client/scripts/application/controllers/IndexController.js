IndexController = function($scope, SocketService) {

    var text = Baseball.util.text;
    var Game = Baseball.Game;
    var Animator = Baseball.service.Animator;

    window.s = $scope;
    $scope.t = text;

    $scope.y = new Game();

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
        var storedMode = localStorage.__$yakyuuaikoukai_text_mode;
        if (storedMode === 'e' || storedMode === 'n') {
            $scope.mode(storedMode);
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

    $scope.abbreviatePosition = function(position) {
        if (text.mode === 'e') {
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

    $scope.sim = function() {$scope.proceedToGame(1, 1);};
    $scope.seventh = function() {$scope.proceedToGame(7, 1);};
    $scope.playball = function() {$scope.proceedToGame();};
    $scope.spectate = function() {$scope.proceedToGame(0, 1);};

    $scope.proceedToGame = function(quickMode, spectateCpu) {
        $scope.begin = true;
        var game = $scope.y;
        game.humanControl = spectateCpu ? 'none' : 'home';
        game.console = !!quickMode && quickMode !== 7;
        var field = window.location.hash ? window.location.hash.slice(1) : game.teams.home.name + Math.ceil(Math.random()*47);
        if (typeof SockJS !== 'undefined') {
            var socketService = $scope.socketService = new SocketService(game);
            socketService.start(field);
        } else {
            console.log('no socket client');
        }
        window.location.hash = '#' + field;
        bindMethods();
        $('.blocking').remove();
        $('.play-begins').show();
        if (game.humanControl === 'none' && game.console) {
            var n = 0;
            Animator.console = true;
            game.console = true;
            do {
                n++;
                game.simulateInput(function(callback) {
                    typeof callback == 'function' && callback();
                });
            } while (game.stage !== 'end' && n < 500);
            Animator.console = game.console = false;
            log('sim ended');
            game.debugOut();
        } else if (quickMode === 7 && spectateCpu === 1) {
            Animator.console = game.console = true;
            do {
                game.simulateInput(function(callback) {
                    typeof callback == 'function' && callback();
                });
            } while (game.inning < 7);
            log('sim halted in 7th');
            game.debugOut();
            Animator.console = game.console = false;
            game.stage = 'pitch';
            game.half = 'top';
            game.humanControl = 'home';
            game.umpire.onSideChange();
        } else if (game.humanControl === 'none') {
            var scalar = game.console ? 0.05 : 1;
            var auto = setInterval(function() {
                if (game.stage === 'end') {
                    clearInterval(auto);
                }
                game.simulatePitchAndSwing(function(callback) {
                    $scope.updateFlightPath(callback);
                });
            }, scalar*(game.field.hasRunnersOn() ? Animator.TIME_FROM_SET + 2000 : Animator.TIME_FROM_WINDUP + 2000));
        }
        if (game.humanControl === 'away') {
            game.simulateInput(function(callback) {
                $scope.updateFlightPath(callback);
            });
        }
        if (game.humanControl === 'home') {
            $scope.showMessage = true;
        }
        if (!quickMode || quickMode === 7) {
            Animator.loop.setTargetTimeOfDay(game.startTime.h, game.startTime.m);
            game.timeOfDay.h = game.startTime.h;
            game.timeOfDay.m = game.startTime.m;
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

        $scope.generateTeam = function(heroRate) {
            $scope.y.teams.away = new Baseball.model.Team($scope.y, heroRate);
        };
        $scope.clickLineup = function(player) {
            if (player.team.sub !== player.team.noSubstituteSelected) {
                var sub = player.team.sub;
                player.team.sub = null;
                return sub.substitute(player);
            }
            player.team.expanded = (player.team.expanded == player ? null : player);
        };
        $scope.selectSubstitute = function(player) {
            if (game.humanControl === 'home' && player.team !== game.teams.home) return;
            if (game.humanControl === 'away' && player.team !== game.teams.away) return;
            player.team.sub = (player.team.sub === player ? player.team.noSubstituteSelected : player);
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
        };
        game.startOpponentPitching = function(callback) {
            $scope.updateFlightPath(callback);
        };
        $scope.indicate = function($event) {
            if (!$scope.allowInput) {
                return;
            }
            if (game.humanPitching()) {
                $scope.allowInput = false;
                game.pitcher.windingUp = false;
            }
            if (game.pitcher.windingUp) {
                return;
            }
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
        game.umpire.onSideChange = function() {
            if (game.humanBatting()) {
                $('.input-area').mousemove(showBat);
            } else {
                $('.input-area').unbind('mousemove', showBat);
                bat.hide();
            }
            if (game.humanPitching()) {
                $('.input-area').mousemove(showGlove);
            } else {
                $('.input-area').unbind('mousemove', showGlove);
                glove.hide();
            }
        };
        game.umpire.onSideChange();
        //var aside = {
        //    left: $('aside.image-panel.left'),
        //    right: $('aside.image-panel.right')
        //};
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

(function(app) {

    app.Main = ng.core
        .Component({
            selector: 'application-hook',
            templateUrl: './public/html/views/main.html',
            directives: [
                ng.common.NgStyle,
                ng.common.NgFor,
                app.BattersDataComponent,
                app.BatteryDataComponent,
                app.FlagComponent,
                app.RatingBlockComponent,
                app.ScoreboardComponent
            ],
            pipes: [app.ToIterableService]
        })
        .Class({
            constructor: function() {
                IndexController(this, SocketService);
            }
        });

})(window.app || (window.app = {}));