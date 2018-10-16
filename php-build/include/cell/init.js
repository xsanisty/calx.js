/**
 * Initialize the cell object, preparing all necessary variables
 * @return {void}
 */
cell.fx.init = function(){
    /** set cell element, is it in dom, or in memory */
    if(typeof(this.options.element) != 'undefined'){
        this.el = $(this.options.element);
    }else{
        this.el = false;
        this.address = typeof(this.options.address) != 'undefined' ? this.options.address : '';
    }

    /** Set cell options based on given options or data attributes */
    var $address        = (this.el && this.el.attr('data-cell'))            ? this.el.attr('data-cell')    : this.options.address,
        $formula        = (this.el && this.el.attr('data-formula'))         ? this.el.attr('data-formula') : this.options.formula,
        $format         = (this.el && this.el.attr('data-format'))          ? this.el.attr('data-format')  : this.options.format,
        $value          = (this.el && this.el.val())                        ? this.el.val()                : this.options.value,
        $formatter      = (this.el && this.el.attr('data-formatter'))       ? window[this.el.attr('data-formatter')]        : this.options.formatter,
        $unformatter    = (this.el && this.el.attr('data-unformatter'))     ? window[this.el.attr('data-unformatter')]      : this.options.unformatter,
        $styleFormatter = (this.el && this.el.attr('data-style-formatter')) ? window[this.el.attr('data-style-formatter')]  : this.options.styleFormatter,
        tagName         = (this.el) ? this.el.prop('tagName').toLowerCase() : '';

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

    if(this.el && this.formTags.indexOf(tagName) == -1){
        $value = this.el.text();
    }

    /** fallback to default format where data-format is not present or empty */
    if($format === false || typeof($format) === 'undefined'){
        $format = this.sheet.config.defaultFormat;
    }

    this.formula            = $formula;
    this.format             = $format;
    this.address            = $address;
    this.formatter          = $formatter;
    this.unformatter        = $unformatter;
    this.conditionalStyle   = $styleFormatter; //deprecated
    this.styleFormatter     = $styleFormatter;


    //console.log('cell[#'+this.sheet.elementId+'!'+$address+'] : Initializing the cell');
    if($format && typeof(numeral) != 'undefined' && $.trim($value) !== ''){
        var rawValue = numeral().unformat($value);

        if($format.indexOf('%') > -1 && ($value).indexOf('%') == -1){
            rawValue = rawValue/100;
        }
    } else if (this.unformatter) {
        rawValue = this.unformatter($value, $format);
    } else {
        rawValue = ($.isNumeric($value)) ? parseFloat($value) : $value;
    }

    this.setValue(rawValue);

    if($.trim($value) != '' && $.isNumeric($value)){
        this.renderComputedValue();
    }
    //this.attachEvent();
};
