/**
 * render calculated value or final value to the element bound to this cell
 * @return {void}
 */
cell.fx.renderComputedValue = function(){
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : rendering computed value');

    if(this.formula && this.formula.substring(0,5).toLowerCase() == 'graph'){
        return this;
    }else if(false !== this.el){
        var tagName     = this.el.prop('tagName').toLowerCase(),
            isFormTag   = this.formTags.indexOf(tagName) > -1,
            originalVal = (this.formula) ? this.computedValue : this.value,
            formattedVal= (
                            this.format != ''
                            && typeof(numeral) != 'undefined'
                            && originalVal !== ''
                            && originalVal !== false
                            && originalVal !== null
                            && data.ERROR.indexOf(originalVal) == -1
                            && $.isNumeric(originalVal)
                        )
                        ? numeral(originalVal).format(this.format)
                        : originalVal;

        //console.log('render computed value of '+this.address+ ' with formula '+this.formula);
        if(isFormTag){
            if(this.isCheckbox){
                this.el.prop('checked', (originalVal == this.el.val()));
            }else if(tagName == 'select'){
                this.el.val(originalVal);
            }else if(tagName == 'input' || tagName == 'textarea'){
                this.el.val(formattedVal);
            }
        }else{
            this.el.html(formattedVal);
        }
    }

    //console.log(typeof(this.conditionalStyle));

    if(typeof(this.conditionalStyle) == 'function'){
        var css = this.conditionalStyle.apply(null, [this.getValue(), this.el]);

        if(typeof(css) == 'object'){
            this.el.css(css);
        }
    }

    return this;
}