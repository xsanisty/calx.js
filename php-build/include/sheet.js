/**
 * Sheet object, represent each element as single sheet
 * @param  {string}     identifier :unique key for accessing sheet object internally
 * @param  {domElement} element    :dom element as scope for sheet to work with
 * @param  {object}     config     : configuration object
 * @return {void}
 */
function sheet(identifier, element, config){
    this.identifier   = identifier;
    this.el           = $(element);
    this.lang         = 'en';
    this.cells        = {};
    this.variables    = {};
    this.config       = $.extend({}, defaultConfig, config);
    this.counter      = 1;
    this.relatedSheet = false;
    this.elementId    = this.el.attr('id');
    this.dependant    = {};
    this.dependencies = {};
    this.calculated   = false;
    this.calculating  = false;
    this.activeCell   = null;
    this.totalCell    = 0;
    this.affectedCell = [];

    this.init();
};

sheet.fx = sheet.prototype;