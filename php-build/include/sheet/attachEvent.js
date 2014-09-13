sheet.prototype.attachEvent = function(){
    //console.log('sheet['+this.identifier+'] : attaching events to the element');

    var currentSheet = this;

    /**
     * get the unformatted value of the cell, and display it to the element
     */
    this.el.on('calx.getValue', 'input[data-cell]', function(){
        var cellAddr    = $(this).attr('data-cell'),
            currentCell = currentSheet.cells[cellAddr];

        currentCell.el.val(currentCell.getValue());
    });

    /**
     * get the formatted value of the cell, and display it to the element
     */
    this.el.on('calx.getComputedValue', 'input[data-cell]', function(){
        var cellAddr    = $(this).attr('data-cell'),
            currentCell = currentSheet.cells[cellAddr];

        currentCell.renderComputedValue();
    });

    /**
     * update value of the current cell internally
     */
    this.el.on('calx.setValue', 'input[data-cell], select', function(){
        var cellAddr    = $(this).attr('data-cell'),
            currentCell = currentSheet.cells[cellAddr];

        currentSheet.cells[cellAddr].setValue($(this).val());

    });

    /**
     * calculate the whole sheet
     */
    this.el.on('calx.calculateSheet', 'input[data-cell]', function(){
        currentSheet.calculate();
    });

    /**
     * update current cell value, and recalculate it's dependant
     */
    this.el.on('calx.calculateCellDependant', 'input[data-cell], select', function(){
        var cellAddr    = $(this).attr('data-cell'),
            currentCell = currentSheet.cells[cellAddr];

        currentSheet.clearProcessedFlag();
        currentCell.calculate();
        currentSheet.renderComputedValue();

    });

    /** bind to internal event, so no need to unbind the real event on destroy */
    this.el.on(currentSheet.config.autoCalculateTrigger, 'input[data-cell]',function(){
        //console.log('blurred');
        if(!$(this).attr('data-formula')){
            if(currentSheet.config.autoCalculate){
                //console.log('calculating dependant');
                $(this).trigger('calx.calculateCellDependant');
            }
        }
    });

    this.el.on('blur', 'input[data-cell]', function(){
        //console.log('blurred');
        $(this).trigger('calx.getComputedValue');
    });

    /**
     * change behaviour, based on configuration
     * autoCalculate : on   => calx.calculateCellDependant
     * autoCalculate : off  => calx.setValue
     */
    this.el.on('change', 'select', function(){
        $(this).trigger('calx.setValue');

        if(currentSheet.config.autoCalculate){
            $(this).trigger('calx.calculateCellDependant');
        }
    });

    /** focus does not depend on configuration, always get the value on focus */
    this.el.on('focus', 'input[data-cell]',function(){
        $(this).trigger('calx.getValue');
    });

    /** keyup does not depend on configuration, always set value on keyup */
    this.el.on('keyup', 'input[data-cell]',function(e){
        if($(this).attr('data-formula')){
            e.preventDefault();
            return false;
        }else{
            $(this).trigger('calx.setValue');
        }
    });
};

sheet.prototype.detachEvent = function(){
    //console.log('sheet['+this.identifier+'] : detaching events from the element');

    this.el.off('calx.getValue');
    this.el.off('calx.setValue');
    this.el.off('calx.getComputedValue');
    this.el.off('calx.calculateSheet');
    this.el.off('calx.calculateCellDependant');
}