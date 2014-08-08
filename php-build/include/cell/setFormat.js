cell.prototype.setFormat = function(format){
    this.format = format;
    if(false !== this.el){
        this.el.attr('data-format', format);
    }
};