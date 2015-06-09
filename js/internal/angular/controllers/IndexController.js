IndexController = function($scope) {
    window.s = $scope;
    $scope.t = text;

    $scope.mode = function(setMode) {
        if (setMode) {
            mode = setMode;
        }
        return mode;
    };

    $scope.proceedToGame = function(quickMode, spectateCpu) {
        Game.prototype.humanControl = spectateCpu ? 'none' : 'home';
        Game.prototype.quickMode = !!quickMode;
        $scope.y = new Game();
        s2.y = $scope.y;
        bindMethods();
        jQ('.blocking').remove();
        if ($scope.y.humanControl == 'none' && $scope.y.quickMode) {
            var game = $scope.y;
            var n = 0;
            do {
                n++;
                game.simulateInput(function(callback) {
                    typeof callback == 'function' && callback();
                });
            } while (game.stage != 'end' && n < 500);
            $scope.y = game;
            log('sim ended');
            $scope.y.debugOut();
        } else if ($scope.y.humanControl == 'none') {
            var scalar = $scope.y.quickMode ? 0.05 : 1;
            var auto = setInterval(function() {
                if ($scope.y.stage == 'end') {
                    clearInterval(auto);
                }
                $scope.y.simulatePitchAndSwing(function(callback) {
                    $scope.y.quickMode ? void 0 : $scope.$apply();
                    $scope.updateFlightPath(callback);
                });
            }, scalar*($scope.y.field.hasRunnersOn() ? 4000 : 5500));
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
        $scope.holdUpTimeouts = [];
        $scope.expandScoreboard = false;
        var animator = new Animator();
        $scope.updateFlightPath = animator.updateFlightPath.bind($scope);
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
            if (mode == 'e') {
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
    };


};