cell.prototype.attachEvent = function(){
    var tagName     = this.el.prop('tagName').toLowerCase(),
        isFormTag   = this.formTags.indexOf(tagName) > -1,
        currentCell = this;

    /**
     * attach event only if it is form element
     */
    if(isFormTag){

        this.el.on('calxChange', function(){
            this.setValue(this.el.val());
        });

        if(tagName == 'input'){
            this.el.on('claxFocus', function(){
                this.el.val(currentCell.getValue());
            });

            this.el.on('calxBlur', function(){
                currentCell.setValue(currentCell.el.val());
            });

            this.el.on('calxKeyDown', function(){

            });

            this.el.on('calxKeyUp', function(){

            });

            this.el.blur(function(){
                $(this).trigger('calxBlur');
            });

            this.el.focus(function(){
                $(this).trigger('calxFocus');
            });
        }else if(tagName == 'select'){

            this.el.change(function(){
                $(this).trigger('calxChange');
            });
        }
    }
};