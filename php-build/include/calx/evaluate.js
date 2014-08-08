/**
 * Evaluate formula specific to sheet
 * @param  {string} formula     the formula to be evaluated
 * @return {mixed}              result of the formula evaluation
 */
evaluate : function(formula){
    var $this       = $(this),
        $identifier = $this.attr('data-calx-identifier')
        $sheet      = calx.sheetRegistry[$identifier];

    return $sheet.evaluate(formula);
}