cell.prototype.init = function(){
    var $address = (this.el) ? this.el.attr('data-cell') : '',
        $formula = (this.el) ? this.el.attr('data-formula') : '',
        $format  = (this.el) ? this.el.attr('data-format') : '',
        $value   = (this.el) ? this.el.val() : null;

    if(!$address || $.trim($address) == ''){
        $address = 'CALX'+this.sheet.counter;
        if(this.el) {
            this.el.attr('data-cell', $address);
        }
        this.sheet.counter++;
    }else{
        $address = $address.toUpperCase()
    }

    if(!$formula || $.trim($formula) == ''){
        $formula = false;
    }else{
        $formula = $formula.replace('&quot;', '"')
                           .replace('&#39;', "'")
                           .replace('&#34;', '"')
    }

    if(!$format || $.trim($format) == ''){
        $format = false;
    }

    this.value      = $value;
    this.formula    = $formula;
    this.format     = $format;
    this.address    = $address;

    this.setValue($value);
    this.attachEvent();
};