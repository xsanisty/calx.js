sheet.prototype.attachEvent = function(){

    var currentSheet = this;

    /**
     * get the unformatted value of the cell, and display it to the element
     */
    this.el.on('getOriginalValue', 'input[data-cell]', function(){
        var cellAddr    = $(this).attr('data-cell'),
            currentCell = currentSheet.cells[cellAddr];

        currentCell.el.val(currentCell.getValue());
    });

    /**
     * update value of the current cell, render the formatted value, and process it's dependant
     */
    this.el.on('updateRenderCalculate', 'input[data-cell]', function(){
        var cellAddr    = $(this).attr('data-cell'),
            currentCell = currentSheet.cells[cellAddr];

        if(
            currentCell.getFormat()
            && typeof(numeral) != 'undefined'
            && currentCell.el.val() != ''
            && data.ERROR.indexOf(currentCell.el.val()) == -1
        ){
            var unformattedVal = numeral().unformat(currentCell.el.val());
            currentCell.setValue(unformattedVal);

        }else{
            currentCell.setValue(currentCell.el.val());
        }
        currentCell.renderComputedValue();
        currentCell.processDependant(false, true);
    });

    /**
     * update value of current cell without render it's own value, and process it's dependant
     * @return {[type]} [description]
     */
    this.el.on('updateCalculate', 'input[data-cell]', function(){
        var cellAddr    = $(this).attr('data-cell'),
            currentCell = currentSheet.cells[cellAddr];

        if(
            currentCell.getFormat()
            && typeof(numeral) != 'undefined'
            && currentCell.el.val() != ''
            && data.ERROR.indexOf(currentCell.el.val()) == -1
        ){
            var unformattedVal = numeral().unformat(currentCell.el.val());
            currentCell.setValue(unformattedVal, false);

        }else{
            currentCell.setValue(currentCell.el.val(), false);
        }
    });

    /** bind to internal event, so no need to unbind the real event on destroy */
    this.el.on('blur', 'input[data-cell]',function(){
        $(this).trigger('updateRenderCalculate');
    });

    this.el.on('change', 'input[data-cell], select',function(){
        $(this).trigger('updateRenderCalculate');
    });

    this.el.on('focus', 'input[data-cell]',function(){
        $(this).trigger('getOriginalValue');
    });

    this.el.on('keyup', 'input[data-cell]',function(){
        $(this).trigger('updateCalculate');
    });
};

sheet.prototype.detachEvent = function(){
    this.el.off('getOriginalValue');
    this.el.off('updateRenderCalculate');
    this.el.off('updateCalculate');
}