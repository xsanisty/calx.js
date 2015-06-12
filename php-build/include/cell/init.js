/**
 * Initialize the cell object, preparing all necessary variables
 * @return {void}
 */
cell.fx.init = function(){
    var $address = (this.el) ? this.el.attr('data-cell') : '',
        $formula = (this.el) ? this.el.attr('data-formula') : '',
        $format  = (this.el) ? this.el.attr('data-format') : false,
        $value   = (this.el) ? this.el.val() : null,
        tagName  = this.el.prop('tagName').toLowerCase();

    /** assign address if data-cell is not present */
    if(!$address || $.trim($address) == ''){
        $address = 'CALX'+this.sheet.counter;
        if(this.el) {
            this.el.attr('data-cell', $address);
        }
        this.sheet.counter++;
    }else{
        $address = $address.toUpperCase()
    }

    /** set the formula as false if data-formula exists, but empty */
    if(!$formula || $.trim($formula) == ''){
        $formula = false;
    }else{
        $formula = $formula.replace('&quot;', '"')
                           .replace('&#39;', "'")
                           .replace('&#34;', '"')
    }

    if(tagName == 'input' && (this.el.attr('type') == 'checkbox' || this.el.attr('type') == 'radio')){
        var uncheckedVal = this.el.attr('data-unchecked');
            uncheckedVal = (typeof(uncheckedVal) == 'undefined') ? '' : uncheckedVal;

        $value = (this.el.prop('checked')) ? this.el.val() : uncheckedVal;
        this.isCheckbox = true;
    }

    if(this.formTags.indexOf(tagName) == -1){
        $value = this.el.text();
    }

    /** fallback to default format where data-format is not present or empty */
    if($format === false || typeof($format) === 'undefined'){
        $format = this.sheet.config.defaultFormat;
    }

    this.formula    = $formula;
    this.format     = $format;
    this.address    = $address;


    //console.log('cell[#'+this.sheet.elementId+'!'+$address+'] : Initializing the cell');
    this.setValue($value);

    if($.trim($value) != '' && $.isNumeric($value)){
        this.renderComputedValue();
    }
    //this.attachEvent();
};