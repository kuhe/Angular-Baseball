var AtBat = function(text) {
    this.text = text.split('*')[0];
    this.rbi = (text.split(this.text)[1] + '');
};
AtBat.prototype.toString = function() {
    return this.text;
};
AtBat.prototype.constructor = AtBat;
AtBat.prototype.identifier = 'AtBat';