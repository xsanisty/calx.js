sheet.prototype.attachEvent = function(){

    var currentSheet = this;
    this.el.on('calxFocus', 'input[data-cell]', function(){
        var cellAddr    = $(this).attr('data-cell'),
            currentCell = currentSheet.cells[cellAddr];

        currentCell.el.val(currentCell.getValue());
    });

    this.el.on('calxBlur', 'input[data-cell]', function(){
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

    this.el.on('calxKeyup', 'input[data-cell]', function(){
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
        $(this).trigger('calxBlur');
    });

    this.el.on('focus', 'input[data-cell]',function(){
        $(this).trigger('calxFocus');
    });

    this.el.on('keyup', 'input[data-cell]',function(){
        $(this).trigger('calxKeyup');
    });
};