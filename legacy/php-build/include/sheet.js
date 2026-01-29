/**
 * Sheet object, represent each element as single sheet
 * @param  {string}     identifier :unique key for accessing sheet object internally
 * @param  {domElement} element    :dom element as scope for sheet to work with
 * @param  {object}     config     : configuration object
 * @return {void}
 */
function sheet(identifier, element, config){
    /** @type {string} The sheet unique identifier */
    this.identifier   = identifier;

    /** @type {object} jQuery dom element */
    this.el           = $(element);

    /** @type {string} The id of the element where the sheet is initialized and bound */
    this.elementId    = this.el.attr('id');

    /** @type {string} Default language setting */
    this.lang         = 'en';

    /** @type {object} Cells registry containing all available cell */
    this.cells        = {};

    /** @type {object} Variable registry, containing all defined variable */
    this.variables    = {};

    /** @type {object} Sheet configuration object */
    this.config       = config;

    /** @type {number} Cell counter, count total cell in the sheet */
    this.counter      = 1;

    /** @type {boolean} Indicate if the sheet has relation with other sheet */
    this.relatedSheet = false;

    /** @type {object} Registry containing sheets that depend on this sheet */
    this.dependant    = {};

    /** @type {object} Registry containing sheets that this sheet depend on*/
    this.dependencies = {};

    /** @type {boolean} Indicate the current sheet calculation is done */
    this.calculated   = false;

    /** @type {boolean} Indicate the current sheet calculation is in progress */
    this.calculating  = false;

    /** @type {object} Current cell object being calculated */
    this.activeCell   = null;
    this.totalCell    = 0;
    this.affectedCell = [];

    this.init();
};

sheet.fx = sheet.prototype;
