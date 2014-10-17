/**
 * Initialize the cell object, preparing all necessary variables
 * @return {void}
 */
cell.fx.init = function(){
    var $address = (this.el) ? this.el.attr('data-cell') : '',
        $formula = (this.el) ? this.el.attr('data-formula') : '',
        $format  = (this.el) ? this.el.attr('data-format') : '',
        $value   = (this.el) ? this.el.val() : null;

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

    /** fallback to default format where data-format is not present or empty */
    if(!$format || $.trim($format) == ''){
        $format = this.sheet.config.defaultFormat;
    }

    this.formula    = $formula;
    this.format     = $format;
    this.address    = $address;


    //console.log('cell[#'+this.sheet.elementId+'!'+$address+'] : Initializing the cell');
    this.setValue($value);
    //this.attachEvent();
};