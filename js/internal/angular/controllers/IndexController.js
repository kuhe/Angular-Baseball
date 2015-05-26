IndexController = function($scope) {
    window.s = $scope;
    $scope.y = new Game();
    $scope.t = text;

    $scope.proceedToGame = function(quickMode, AIonly) {
        Game.prototype.humanControl = AIonly ? 'none' : 'home';
        Game.prototype.quickMode = !!quickMode;
        $scope.y = new Game();
        s2.y = $scope.y;
        bindMethods();
        jQ('.blocking').remove();
        if ($scope.y.humanControl == 'none' && $scope.y.quickMode) {
            var game = $scope.y;
            $scope.y = new Game();
            var n = 0;
            do {
                n++;
                game.simulateInput(function(callback) {
                    typeof callback == 'function' && callback();
                });
            } while (game.stage != 'end' && n < 500);
            $scope.y = game;
            log('sim ended');
        } else if ($scope.y.humanControl == 'none') {
            var scalar = $scope.y.quickMode ? 0.05 : 1;
            var auto = setInterval(function() {
                if ($scope.y.stage == 'end') {
                    clearInterval(auto);
                }
                $scope.$apply();
                $scope.y.simulateInput(function(callback) {
                    $scope.y.quickMode ? void 0 : $scope.$apply();
                    $scope.updateFlightPath(callback);
                });
            }, scalar*($scope.y.field.hasRunnersOn() ? 1800 : 3300));
        }
        if ($scope.y.humanControl == 'away') {
            $scope.y.simulateInput(function(callback) {
                $scope.updateFlightPath(callback);
            });
        }
        if ($scope.y.humanControl == 'home') {

        }
    };

    var bindMethods = function() {
        $scope.mode = function(setMode) {
            if (setMode) {
                mode = setMode;
            }
            return mode;
        };
        $scope.holdUpTimeouts = [];
        $scope.expandScoreboard = false;
        $scope.updateFlightPath = function(callback) {
            var ss = document.styleSheets;
            var animation = 'flight';
            for (var i = 0; i < ss.length; ++i) {
                for (var j = 0; j < ss[i].cssRules.length; ++j) {
                    if ((
                        ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE ||
                        ss[i].cssRules[j].type == window.CSSRule.KEYFRAMES_RULE
                        )
                        && ss[i].cssRules[j].name == animation) {
                        var rule = ss[i].cssRules[j];
                    }
                }
            }
            var keyframes = rule;
            var to = function(percent, top, left) {
                var originTop = 50;
                var originLeft = 110 + ($scope.y.pitcher.throws == 'left' ? 20 : -20);
                Math.square = function(x) { return x*x };
                left = originLeft + Math.square(percent/100)*(left - originLeft);
                top = originTop + Math.square(percent/100)*(top - originTop);
                var padding = Math.max(Math.square(percent/100)*13, 2);
                var borderWidth = Math.square(percent/100)*4;
                return 'top: '+top+'px; left: '+left+'px; padding: '+padding+'px; border-width:'+borderWidth+'px';
            };
            var game = $scope.y;
            var top = 200-game.pitchTarget.y;
            var left = game.pitchTarget.x;
            var breakTop = 200-game.pitchInFlight.y,
                breakLeft = game.pitchInFlight.x;

            keyframes.deleteRule(0);
            keyframes.deleteRule(0.25);
            keyframes.deleteRule(0.50);
            keyframes.deleteRule(0.75);
            keyframes.deleteRule(1);

            keyframes.appendRule('0% { '+to(15, top, left)+' }');
            keyframes.appendRule('25% { '+to(20, top, left)+' }');
            keyframes.appendRule('50% { '+to(35, top, left)+' }');
            keyframes.appendRule('75% { '+to(65, top, left)+' }');
            keyframes.appendRule('100% { '+to(100, breakTop, breakLeft)+' }');

            var $baseballs = jQ('.baseball');
            var flightSpeed = 1.3 - 0.6*(game.pitchInFlight.velocity + 300)/400;
            $baseballs.css('-webkit-animation', 'flight '+flightSpeed+'s 1 0s linear');
            $baseballs.removeClass('flight');
            $baseballs.addClass('flight');

            $scope.lastTimeout = setTimeout(function() {
                jQ('.baseball').removeClass('flight');
                jQ('.baseball').addClass('spin');
                var horizontalBreak = (60 - Math.abs(game.pitchTarget.x - game.pitchInFlight.x))/10;
                jQ('.baseball').css('-webkit-animation', 'spin '+horizontalBreak+'s 5 0s linear');
                $scope.allowInput = true;
                if (typeof callback == 'function') {
                    callback();
                    $scope.$apply();
                }
            }, flightSpeed*1000);

            if (!game.pitchInFlight.x) {
                $baseballs.addClass('hide');
            } else {
                if (game.humanBatting() && Math.random()*100 > game.batter.skill.offense.eye) {
                    jQ('.baseball.break').addClass('hide');
                } else {
                    jQ('.baseball.break').removeClass('hide');
                }
                jQ('.baseball.pitch').removeClass('hide');
            }
            jQ('.baseball.pitch').css({
                top: 200-game.pitchTarget.y,
                left: game.pitchTarget.x
            });
            jQ('.baseball.break').css({
                top: 200-game.pitchInFlight.y,
                left: game.pitchInFlight.x
            });
            $baseballs.each(function(k, item) {
                var elm = item,
                    newOne = elm.cloneNode(true);
                elm.parentNode.replaceChild(newOne, elm);
            });

            if ($scope.y.humanBatting() && !$scope.y.humanPitching()) {
                $scope.holdUpTimeouts.push(setTimeout(function() {
                    $scope.holdUp();
                }, (flightSpeed + 1.2) * 1000));
            }
        };
        $scope.selectPitch = function(pitchName) {
            if ($scope.y.stage == 'pitch') {
                $scope.y.pitchInFlight = jQ.extend({}, $scope.y.pitcher.pitching[pitchName]);
                $scope.y.pitchInFlight.name = pitchName;
                $scope.y.swingResult.looking = true;
            }
        };
        $scope.allowInput = true;
        $scope.holdUp = function() {
            jQ('.no-swing').click();
            $scope.$apply();
            //$scope.y.receiveInput(-20, 100, function() {
            //    $scope.updateFlightPath();
            //});
        };
        $scope.y.startOpponentPitching = function(callback) {
            $scope.updateFlightPath(callback);
        };
        $scope.indicate = function($event) {
            if (!$scope.allowInput) {
                return;
            }
            if ($scope.y.pitcher.windingUp) {
                return;
            }
            if ($scope.y.humanPitching()) $scope.allowInput = false;
            var offset = jQ('.target').offset();
            var relativeOffset = {
                x : $event.pageX - offset.left,
                y : 200 - ($event.pageY - offset.top)
            };
            clearTimeout($scope.lastTimeout);
            while ($scope.holdUpTimeouts.length) {
                clearTimeout($scope.holdUpTimeouts.shift());
            }
            $scope.y.receiveInput(relativeOffset.x, relativeOffset.y, function(callback) {
                $scope.updateFlightPath(callback);
            });
        };
        $scope.abbreviatePosition = function(position) {
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
        };
    };


};