/************************************************
 *             Default Configuration            *
 ************************************************/

var defaultConfig = {
    'autoCalculate'         : true,
    'autoCalculateTrigger'  : 'blur',
    'onBeforeCalculate'     : function(data){return data},
    'onAfterCalculate'      : function(data){return data},
    'onBeforeApply'         : function(data){return data},
    'onAfterApply'          : function(data){return data},
    'zeroFormat'            : null,
    'precision'             : 2,
    'defaultFormat'         : '0[.]00',
    'ajaxUrl'               : null
};