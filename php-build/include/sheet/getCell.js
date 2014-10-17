/**
 * get cell object based on given address
 * @param  {string} address     cell address (A1, B1 etc)
 * @return {cell|false}         cell object represented by the address or false if not found
 */
sheet.prototype.getCell = function(address){

    address = address.toUpperCase();
    if(typeof(this.cells[address]) != 'undefined'){
        return this.cells[address];
    }else{
        return false;
    }
};