define(function(){
    var Field = function(game) {
        this.init(game);
    };

    Field.prototype = {
        init : function(game) {
            this.game = game;
        }
    };
    return Field;
});