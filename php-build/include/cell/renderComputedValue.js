/**
 * render calculated value or final value to the element bing to this cell
 * @return {void}
 */
cell.prototype.renderComputedValue = function(){
    if(false !== this.el){
        var tagName     = this.el.prop('tagName').toLowerCase(),
            isFormTag   = this.formTags.indexOf(tagName) > -1;

        if(this.formula){
            if(isFormTag){
                this.el.val(this.computedValue);
            }else{
                this.el.html(this.computedValue);
            }
        }else{
            if(isFormTag){
                this.el.val(this.value);
            }else{
                this.el.html(this.value);
            }
        }
    }
}