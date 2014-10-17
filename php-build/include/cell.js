/**
 * cell hold single element with formula and value information
 * @param  {sheet}      sheet       the sheet object where the cell is belong to
 * @param  {element}    element     dom element represent the cell (optional)
 * @return {void}
 */
function cell(sheet, element){
    this.sheet = sheet;

    /** set cell element, is it in dom, or in memory */
    if(typeof(element) != 'undefined'){
        this.el = $(element);
    }else{
        this.el = false;
    }

    this.value              = null;
    this.formattedValue     = null;
    this.computedValue      = null;
    this.floatValue         = null;
    this.affected           = false;
    this.processed          = false;
    this.dependencies       = {};
    this.dependant          = {};
    this.conditionalStyle   = false;
    this.address            = '';
    this.remoteDependency   = false;
    this.init();
};

cell.fx = cell.prototype;