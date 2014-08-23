/**
 * detach event listener on the dom element bound to the cell object
 * @return {void}
 */
cell.prototype.detachEvent = function(){
    if(false !== this.el){
        var tagName     = this.el.prop('tagName').toLowerCase(),
            isFormTag   = this.formTags.indexOf(tagName) > -1;

        /**
         * attach event only if it is form element
         */
        if(isFormTag){
            if(tagName == 'input'){
                this.el.off('claxFocus');
                this.el.off('calxBlur');
            }else if(tagName == 'select'){
                this.el.off('calxChange');
            }
        }
    }
};