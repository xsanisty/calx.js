/**
 * render calculated value or final value to the element bing to this cell
 * @return {void}
 */
cell.prototype.renderComputedValue = function(){
    if(false !== this.el){
        var tagName     = this.el.prop('tagName').toLowerCase(),
            isFormTag   = this.formTags.indexOf(tagName) > -1,
            originalVal = (this.formula) ? this.computedValue : this.value,
            formattedVal= (
                            this.format
                            && typeof(numeral) != 'undefined'
                            && this.computedValue !== ''
                            && data.ERROR.indexOf(originalVal) == -1
                        )
                        ? numeral(originalVal).format(this.format)
                        : originalVal;

        if(isFormTag){
            this.el.val(formattedVal);
        }else{
            this.el.html(formattedVal);
        }
    }
}