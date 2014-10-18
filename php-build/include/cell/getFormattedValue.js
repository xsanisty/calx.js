/**
 * get formatted value of the cell based on the formula definition
 * @return {string}     the formatted value
 */
cell.fx.getFormattedValue = function(){
    var originalVal = (this.formula) ? this.computedValue : this.value,
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

    return formattedVal;
};