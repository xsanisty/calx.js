/**
 * set cell value and sync it with the bound element, and trigger recalculation on all cell depend to it
 * @param {mixed}   value       value to be inserted into the cell
 * @param {bool}    render      render computed value of it's dependant or not
 */
cell.prototype.setValue = function(value, render){
    this.value          = ($.isNumeric(value)) ? parseFloat(value) : value;
    this.formattedValue = '';

    render = (typeof(render) == 'undefined') ? true : render;

    this.setAffected(true);

    for(var a in this.dependant){
        this.dependant[a].setAffected(true);
    }

    this.processDependant(render, true);
};