IndexController = function($scope) {
    window.s = $scope;
    $scope.t = text;
    $scope.y = new Game();
    $scope.mode = function(set) {
        if (set) {
            mode = set;
        }
        return mode;
    };
    $scope.expandScoreboard = false;
    $scope.proceedToGame = function () {
        jQ('.blocking').remove();
    };
    $scope.updateFlightPath = function($event) {
        var ss = document.styleSheets;
        var animation = 'flight';
        for (var i = 0; i < ss.length; ++i) {
            for (var j = 0; j < ss[i].cssRules.length; ++j) {
                if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == animation) {
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
            breakleft = game.pitchInFlight.x;
        keyframes.deleteRule('0%');
        keyframes.deleteRule('25%');
        keyframes.deleteRule('50%');
        keyframes.deleteRule('75%');
        keyframes.deleteRule('100%');
        keyframes.insertRule('0% { '+to(15, top, left)+' }');
        keyframes.insertRule('25% { '+to(20, top, left)+' }');
        keyframes.insertRule('50% { '+to(35, top, left)+' }');
        keyframes.insertRule('75% { '+to(65, top, left)+' }');
        keyframes.insertRule('100% { '+to(100, breakTop, breakleft)+' }');

        $baseballs = jQ('.baseball');
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
        }, flightSpeed*1000);

        if (!game.pitchInFlight.x) {
            $baseballs.addClass('hide');
        } else {
            if (game.humanBatting()) {
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
                newone = elm.cloneNode(true);
            elm.parentNode.replaceChild(newone, elm);
        });
    };
    $scope.selectPitch = function(pitchName) {
        if ($scope.y.stage == 'pitch') {
            $scope.y.pitchInFlight = jQ.extend({}, $scope.y.pitcher.pitching[pitchName]);
            $scope.y.pitchInFlight.name = pitchName;
            $scope.y.swingResult.looking = true;
        }
    };
    $scope.allowInput = true;
    $scope.indicate = function($event) {
        if (!$scope.allowInput) {
            return;
        }
        if ($scope.y.humanPitching()) $scope.allowInput = false;
        var offset = jQ('.target').offset();
        var relativeOffset = {
            x : $event.pageX - offset.left,
            y : 200 - ($event.pageY - offset.top)
        };
        clearTimeout($scope.lastTimeout);
        $scope.y.receiveInput(relativeOffset.x, relativeOffset.y, function() {
            $scope.updateFlightPath($event);
        });
        if ($scope.y.pitcher.windingUp) {
            var windup = jQ('.windup');
            windup.css('transition', 'none');
            windup.css('width', '100%');
            if ($scope.y.field.hasRunnersOn()) {
                setTimeout(function(){
                    windup.css('transition', 'width 1.5s linear');
                    windup.css('width', '0%');
                }, 1);
            } else {
                setTimeout(function(){
                    windup.css('transition', 'width 3s linear');
                    windup.css('width', '0%');
                }, 1);
            }
        }
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