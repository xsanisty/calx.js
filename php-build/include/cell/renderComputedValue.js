/**
 * render calculated value or final value to the element bing to this cell
 * @return {void}
 */
cell.prototype.renderComputedValue = function(){
    //console.log('cell['+this.address+'] : rendering computed value');

    if(false !== this.el){
        var tagName     = this.el.prop('tagName').toLowerCase(),
            isFormTag   = this.formTags.indexOf(tagName) > -1,
            originalVal = (this.formula) ? this.computedValue : this.value,
            formattedVal= (
                            this.format
                            && typeof(numeral) != 'undefined'
                            && this.computedValue !== ''
                            && this.computedValue !== false
                            && this.computedValue !== null
                            && data.ERROR.indexOf(originalVal) == -1
                            && $.isNumeric(originalVal)
                        )
                        ? numeral(originalVal).format(this.format)
                        : originalVal;

            //console.log(formattedVal);

        ////console.log('render computed value of '+this.address+ ' with formula '+this.formula);
        if(isFormTag){
            this.el.val(formattedVal);
        }else{
            this.el.html(formattedVal);
        }
    }
}