/**
 * set cell value and sync it with the bound element, and trigger recalculation on all cell depend to it
 * @param {mixed}   value       value to be inserted into the cell
 * @param {bool}    render      render computed value of it's dependant or not
 */
cell.prototype.setValue = function(value, render){

    console.log('cell['+this.address+']: seting value to be : '+value);
    if(this.format && typeof(numeral) != 'undefined' && $.trim(value) !== ''){
        this.value = numeral().unformat(value+'');
    }else{
        this.value = ($.isNumeric(value)) ? parseFloat(value) : value;
    }

    /* set value mean set value, no other thing should be done */
};