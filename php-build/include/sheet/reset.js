sheet.prototype.reset = function(){
    var forms;

    if(this.el.prop('tagName').toLowerCase() == 'form'){
        forms = this.el;
    }else{
        forms = this.el.find('form');
    }

    forms.each(function(){
        this.reset();
    });

    for(var a in this.cells){
        this.cells[a].resyncValue();
    }
};