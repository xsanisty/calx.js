/**
 * set cell value and sync it with the bound element, and trigger recalculation on all cell depend to it
 * @param {mixed}   value       value to be inserted into the cell
 */
cell.fx.setValue = function(value){

    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : setting value to be : '+value);

    this.value = value;

    if(this.sheet.affectedCell.indexOf(this.address) == -1){
        this.sheet.affectedCell.push(this.address);
    }

    /* set value mean set value, no other thing should be done */
    return this;
};
