cell.prototype.setValue = function(value){
    this.value          = value;
    this.floatValue     = ($.isNumeric(value)) ? parseFloat(value) : 0;
    this.formattedValue = this.sheet.engine.formatter(
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
};