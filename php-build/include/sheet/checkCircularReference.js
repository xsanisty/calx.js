/**
 * check circular reference on each cell registered to this sheet
 * @return {bool} true if exist, false if clear
 */
sheet.fx.checkCircularReference = function(){
    //console.log('sheet[#'+this.elementId+'] : checking circular reference');
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
};
