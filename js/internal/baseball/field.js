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
        }
    };
    return Field;
});