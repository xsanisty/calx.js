/**
 * set formatting rule to the cell
 * @param {string} format       format rule to define formatting on rendered value
 */
cell.prototype.setFormat = function(format){
    this.format = format;
    if(false !== this.el){
        this.el.attr('data-format', format);
        this.renderComputedValue();
    }
};