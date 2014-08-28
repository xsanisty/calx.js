/**
 * resync cell value with element value, in case the form is reseted
 * @return {[type]} [description]
 */
cell.prototype.resyncValue = function(){
    if(this.el){
        this.setValue(this.el.val());
    }
};