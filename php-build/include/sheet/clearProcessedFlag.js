/**
 * mark all cell as not processed
 */
sheet.prototype.clearProcessedFlag = function(){
    //console.log('sheet['+this.identifier+'] : clearing the processed flag');
    for(var a in this.cells){
        if(false !== this.cells[a].formula){
            this.cells[a].setProcessed(false);
            this.cells[a].setAffected(true);
        }else{
            this.cells[a].setProcessed(true);
            this.cells[a].setAffected(false);
        }
    }
}