/**
 * set value of specific cell on the sheet related to the selected element,
 * the selector should only select single object, e.g. $('#id')
 *
 * @param  {string} address     the cell's address
 * @param  {string} value       the cell's value
 * @return {void}
 */
setValue : function(address, value){
    var $this       = $(this),
        $identifier = $this.attr('data-calx-identifier'),
        $sheet      = calx.sheetRegistry[$identifier],
        $cell       = $sheet.getCell(address);

    $cell.setValue(value).renderComputedValue();

    if($sheet.config.autoCalculate){
        $sheet.calculate();
    }
}
