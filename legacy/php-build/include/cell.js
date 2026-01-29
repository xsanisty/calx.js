/**
 * cell hold single element with formula and value information
 * @param  {sheet}      sheet       the sheet object where the cell is belong to
 * @param  {element}    element     dom element represent the cell (optional)
 * @return {void}
 */
function cell(sheet, options){
    this.sheet = sheet;
    this.options = $.extend({}, {
        element: undefined,
        address: '',
        formatter: undefined,
        unformatter: undefined,
        styleFormatter: undefined,
        format: false,
        formula: false,
        value: null
    }, options);

    this.value              = null;
    this.format             = false;
    this.formula            = false;
    this.formatter          = undefined;
    this.unformatter        = undefined;
    this.formattedValue     = null;
    this.computedValue      = null;
    this.floatValue         = null;
    this.affected           = false;
    this.processed          = false;
    this.dependencies       = {};
    this.dependant          = {};
    this.conditionalStyle   = false; //deprecated
    this.styleFormatter     = false;
    this.address            = '';
    this.remoteDependency   = false;
    this.isCheckbox         = false;
    this.hasDynamicDependency = false;

    this.init();
};

cell.fx = cell.prototype;
