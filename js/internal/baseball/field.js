define(function(){
    var Field = function(game) {
        this.init(game);
    };

    Field.prototype = {
        init : function(game) {
            this.game = game;
            this.first = null;
            this.second = null;
            this.third = null;
        },
        determineSwingContactResult : function(swing) {
            if (typeof swing == 'undefined') swing = this;
            var x = swing.x, y = swing.y;
            var splayAngle = 90 - 1.5*x;
            var flyAngle = -3*y;
            var power = this.game.batter.skill.offense.power;
            var landingDistance = (350 - (power/100)*75) * (1 - Math.abs(flyAngle - 30)/60);
            swing.fielder = this.findFielder(splayAngle, landingDistance);
            swing.foul;
            swing.caught;
            // wip

            var fieldingEase = 1.00;

            return this;
        },
        findFielder : function(splayAngle, landingDistance) {

        },
        lookup : {
            catcherFly : {

            },
            infieldFly : {

            }


        }

    };
    return Field;
});