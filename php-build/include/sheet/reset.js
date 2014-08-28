sheet.prototype.reset = function(){
    if(this.el.prop('tagName').toLowerCase() == 'form'){
        this.el.reset();
    }
    for(var a in this.cells){
        this.cells[a].resyncVaue();
    }
};