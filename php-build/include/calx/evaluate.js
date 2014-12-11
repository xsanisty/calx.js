/**
 * Evaluate formula specific to the selected sheet,
 * the selector should only select single object, e.g. $('#id')
 *
 * @param  {string} formula     the formula to be evaluated
 * @return {mixed}              result of the formula evaluation
 */
evaluate : function(formula){
    var $this       = $(this),
        $identifier = $this.attr('data-calx-identifier'),
        $sheet      = calx.sheetRegistry[$identifier];

    return $sheet.evaluate(formula);
}