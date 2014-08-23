/************************************************
 *             Default Configuration            *
 ************************************************/

var defaultConfig = {
    /** tell calx to perform auto calculate after change has been made or trigger calculation manually */
    'autoCalculate'         : true,

    /** event that trigger calculation to be executed */
    'autoCalculateTrigger'  : 'blur',

    /** callback triggered right before calculation is performed */
    'onBeforeCalculate'     : function(data){return data},

    /** callback triggered right after calculation is performed */
    'onAfterCalculate'      : function(data){return data},

    /** callback triggered right before calculation result is applied */
    'onBeforeApply'         : function(data){return data},

    /** callback triggered right after calculation result is applied */
    'onAfterApply'          : function(data){return data},

    /** default precision of decimal point to be displayed */
    'precision'             : 2,

    /** default fomatting rule when data-format is not present */
    'defaultFormat'         : false,

    /** used for server side formula */
    'ajaxUrl'               : null,

    /** Available option is morris, highchart, d3 */
    'graphHandler'          : 'flot'

};