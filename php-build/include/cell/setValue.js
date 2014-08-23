/**
 * set cell value and sync it with the bound element, and trigger recalculation on all cell depend to it
 * @param {mixed} value [description]
 */
cell.prototype.setValue = function(value){
    var a;
    this.value          = value;
    this.floatValue     = ($.isNumeric(value)) ? parseFloat(value) : 0;
    this.formattedValue = '';

    this.sheet.engine.formatter(
                            this.floatValue,
                            (this.format) ? this.format : this.sheet.config.defaultFormat
                        );

    if(false !== this.el){
        var tagName     = this.el.prop('tagName').toLowerCase(),
            isFormTag   = this.formTags.indexOf(tagName) > -1;

        if(isFormTag){
            this.el.val(this.value);
        }else{
            this.el.html(this.value);
        }
    }

    this.setAffected(true);
    for(a in this.dependant){
        this.dependant[a].setAffected(true);
    }
};