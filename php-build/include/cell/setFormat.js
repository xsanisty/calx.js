/**
 * set formatting rule to the cell
 * @param {string} format       format rule to define formatting on rendered value
 */
cell.fx.setFormat = function(format){
    this.format = format;
    if(false !== this.el){
        this.el.attr('data-format', format);
        this.renderComputedValue();
    }

    if(this.sheet.affectedCell.indexOf(this.address) == -1){
        this.sheet.affectedCell.push(this.address);
    }

    return this;
};

cell.fx.setFormatter = function(formatter){
    this.formatter = formatter;
}

cell.fx.setUnformatter = function(unformatter){
    this.unformatter = unformatter;
}
