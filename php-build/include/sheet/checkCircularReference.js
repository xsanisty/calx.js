/**
 * check circular reference on each cell registered to this sheet
 * @return {bool} true if exist, false if clear
 */
sheet.prototype.checkCircularReference = function(){
    var a, response = {
            isCircular : false,
            cell : null
        };

    for(a in this.cells){
        response.isCircular = this.cells[a].checkCircularReference();
        if(true === response.isCircular){
            response.cell = this.cells[a];
            return response;
        }
    }

    return response;
}