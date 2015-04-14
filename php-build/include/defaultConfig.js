/************************************************
 *             Default Configuration            *
 ************************************************/

var defaultConfig = {
    /** tell calx to perform auto calculate after change has been made or trigger calculation manually */
    autoCalculate         : true,

    /** event that trigger calculation to be executed */
    autoCalculateTrigger  : 'blur',

    /** callback triggered right before calculation is performed */
    onBeforeCalculate     : null ,

    /** callback triggered right after calculation is performed */
    onAfterCalculate      : null ,

    /** callback triggered right before calculation result is applied */
    onBeforeRender         : null ,

    /** callback triggered right after calculation result is applied */
    onAfterRender          : null ,

    /** default fomatting rule when data-format is not present */
    defaultFormat         : false,

    /** used for server side formula */
    ajaxUrl               : null,

    /** ajax method used for requesting formula result */
    ajaxMethod            : 'get',

    /** Available option is morris, highchart, d3 */
    graphHandler          : 'flot',

    /** check for circular reference on init, default false */
    checkCircularReference: false,

    /** the sheet data contain list of cells with value, formula, and format */
    data                  : {}

};