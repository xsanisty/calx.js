/**
 * Get final raw value of the cell
 * @return {mixed}     the cell value
 */
cell.fx.getValue = function(){
    var returnValue;

    if(this.formula){
        returnValue = this.computedValue;
    }else{
        returnValue = this.value;
    }

    return returnValue;
}
