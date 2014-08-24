/**
 * render calculated value or final value to the element bing to this cell
 * @return {void}
 */
cell.prototype.renderComputedValue = function(){
    if(false !== this.el){
        var tagName     = this.el.prop('tagName').toLowerCase(),
            isFormTag   = this.formTags.indexOf(tagName) > -1,
            formattedVal;

        if(this.formula){
            formattedVal = (this.format && typeof(numeral) != 'undefined' && this.computedValue !== '') ? numeral(this.computedValue).format(this.format) : this.computedValue;
            if(isFormTag){
                this.el.val(formattedVal);
            }else{
                this.el.html(formattedVal);
            }
        }else{
            formattedVal = (this.format && typeof(numeral) != 'undefined' && this.computedValue !== '') ? numeral(this.value).format(this.format) : this.value
            if(isFormTag){
                this.el.val(formattedVal);
            }else{
                this.el.html(formattedVal);
            }
        }
    }
}