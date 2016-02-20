/**
 * register singgle cell to sheet's cell registry
 * @param  {object} cell    cell object
 * @return {void}
 */
sheet.fx.registerCell = function(cell){
    var address = cell.getAddress()
    this.cells[address] = cell;

    if(typeof this.config.data[address] != 'undefined'){
        var cellConfig = this.config.data[address];

        if(typeof cellConfig.value != 'undefined'){
            cell.setValue(cellConfig.value);
            cell.renderComputedValue();
        }

        if(typeof cellConfig.format != 'undefined'){
            cell.setFormat(cellConfig.format);
        }

        if(typeof cellConfig.formula != 'undefined'){
            cell.setFormula(cellConfig.formula);
        }

        if(typeof cellConfig.conditional_style != 'undefined'){
            cell.setConditionalStyle(cellConfig.conditional_style);
        }
    }

    if(this.affectedCell.indexOf(cell.getAddress()) == -1){
        this.affectedCell.push(cell.getAddress());
    }
};