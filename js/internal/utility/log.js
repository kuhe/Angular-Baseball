define(function(){
    var Log = function() {
        this.init();
    };

    Log.prototype = {
        init : function() {
            this.pitchRecord = [];
        },
        note : function(note) {
            this.record.unshift(note);
            this.shortRecord = this.record.slice(0, 20);
        },
        noteBatter : function(batter, order) {
            if (typeof order != 'undefined') {
                order = {
                    0 : ' 1st',
                    1 : ' 2nd',
                    2 : ' 3rd',
                    3 : ' 4th',
                    4 : ' 5th',
                    5 : ' 6th',
                    6 : ' 7th',
                    7 : ' 8th',
                    8 : ' 9th'
                }[order];
            } else {
                order = '';
            }
            positions = {
                first : 'first baseman',
                second : 'second baseman',
                third : 'third baseman',
                short : 'shortstop',
                pitcher : 'pitcher',
                catcher : 'catcher',
                left : 'left fielder',
                center : 'center fielder',
                right : 'right fielder'
            };
            this.note('Now batting'+order+', '+positions[batter.position]+', '+batter.name);
        },
        noteSwing : function(pitchInFlight, swingResult) {
            var pitch = pitchInFlight;
            this.pitchRecord.unshift(pitch.name + ' ('+pitch.x+', '+pitch.y+')');
            var swing = swingResult;
            this.pitchRecord.unshift('Swung at, ' + ' ('+swing.x+', '+swing.y+')' + (swing.contact ? ' and hit.' : ' and missed.'));
        },
        pointer : 0,
        pitchRecord : [],
        shortRecord : [],
        record : []
    };
    return Log;
});