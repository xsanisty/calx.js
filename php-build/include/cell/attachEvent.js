/**
 * attach event listener on the dom element bound to the cell object
 * @return {void}
 */
cell.prototype.attachEvent = function(){
    if(false !== this.el){
        var tagName     = this.el.prop('tagName').toLowerCase(),
            isFormTag   = this.formTags.indexOf(tagName) > -1,
            currentCell = this;

        /**
         * attach event only if it is form element
         */
        if(isFormTag){
            if(tagName == 'input'){
                this.el.on('calxFocus', function(){
                    currentCell.el.val(currentCell.getValue());
                });

                this.el.on('calxBlur', function(){
                    if(
                        currentCell.getFormat()
                        && typeof(numeral) != 'undefined'
                        && currentCell.el.val() != ''
                        && data.ERROR.indexOf(currentCell.el.val()) == -1
                    ){
                        var unformattedVal = numeral().unformat(currentCell.el.val());
                        currentCell.setValue(unformattedVal);

                    }else{
                        currentCell.setValue(currentCell.el.val());
                    }
                    currentCell.renderComputedValue();
                    currentCell.processDependant(false, true);
                });

                this.el.on('calxKeyup', function(){
                    currentCell.setValue(currentCell.el.val());
                    currentCell.processDependant(false, true);
                });

                /** bind to internal event, so no need to unbind the real event on destroy */
                this.el.blur(function(){
                    $(this).trigger('calxBlur');
                });

                this.el.focus(function(){
                    $(this).trigger('calxFocus');
                });

                this.el.keyup(function(){
                    $(this).trigger('calxKeyup');
                });
            }else if(tagName == 'select'){

                this.el.on('calxChange', function(){
                    currentCell.setValue(currentCell.el.val());
                    currentCell.processDependant();
                });
                this.el.change(function(){
                    $(this).trigger('calxChange');
                });
            }
        }
    }
};