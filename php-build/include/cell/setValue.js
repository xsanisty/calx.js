/**
 * set cell value and sync it with the bound element, and trigger recalculation on all cell depend to it
 * @param {mixed} value [description]
 */
cell.prototype.setValue = function(value){
    var a;
    this.value          = value;
    this.floatValue     = ($.isNumeric(value)) ? parseFloat(value) : 0;
    this.formattedValue = '';

    this.setAffected(true);

    for(a in this.dependant){
        this.dependant[a].setAffected(true);
    }

    this.processDependant(true, true);
};