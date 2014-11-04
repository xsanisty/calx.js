<?php header('Content-Type', 'text/javascript') ?>
var Zepto   = Zepto     || undefined,
    jQuery  = jQuery    || Zepto,
    numeral = numeral   || undefined,
    moment  = moment    || undefined,
    jStat   = jStat     || undefined;

(function($, numeral, moment, jStat){

    if(typeof($) == 'undefined'){
        return false;
    }
    <?php

        /**
         * Calx helper function, formula function and formula parser
         */
        require 'include/ieHack.js';
        require 'include/defaultConfig.js';
        require 'include/parserFactory.js';
        require 'include/formula.js';
        require 'include/utility.js';
        require 'include/data.js';

        /**
         * cell reference
         * List all available cell object API method
         */
        require 'include/cell.js';
        require 'include/cell/init.js';
        require 'include/cell/calculate.js';

        require 'include/cell/buildDependency.js';
        require 'include/cell/removeDependency.js';
        require 'include/cell/processDependency.js';

        require 'include/cell/registerDependant.js';
        require 'include/cell/removeDependant.js';
        require 'include/cell/processDependant.js';

        require 'include/cell/hasRemoteDependency.js';

        require 'include/cell/renderComputedValue.js';
        require 'include/cell/resyncValue.js';
        require 'include/cell/resyncFormula.js';
        require 'include/cell/checkCircularReference.js';
        require 'include/cell/evaluateFormula.js';
        #require 'include/cell/attachEvent.js';
        #require 'include/cell/detachEvent.js';
        require 'include/cell/formTags.js';
        require 'include/cell/setConditionalStyle.js';

        require 'include/cell/setFormat.js';
        require 'include/cell/getFormat.js';

        require 'include/cell/setFormula.js';
        require 'include/cell/getFormula.js';

        require 'include/cell/getAddress.js';
        require 'include/cell/getFormattedValue.js';
        #require 'include/cell/getStringValue.js';
        #require 'include/cell/getFloatValue.js';

        require 'include/cell/setValue.js';
        require 'include/cell/getValue.js';

        require 'include/cell/setAffected.js';
        require 'include/cell/isAffected.js';

        require 'include/cell/setProcessed.js';
        require 'include/cell/isProcessed.js';

        require 'include/cell/highlightDependant.js';


        /**
         * sheet reference
         * list all available sheet object API method
         */
        require 'include/sheet.js';
        require 'include/sheet/init.js';
        require 'include/sheet/checkCircularReference.js';
        require 'include/sheet/clearProcessedFlag.js';
        require 'include/sheet/buildCellDependency.js';
        #require 'include/sheet/processDependencyTree.js';
        require 'include/sheet/renderComputedValue.js';
        require 'include/sheet/clearAffectedCell.js';
        require 'include/sheet/hasRelatedSheet.js';
        require 'include/sheet/clearCalculatedFlag.js';
        require 'include/sheet/isCalculated.js';
        require 'include/sheet/setCalculated.js';
        require 'include/sheet/clearDependencies.js';
        require 'include/sheet/registerDependant.js';
        require 'include/sheet/registerDependency.js';
        require 'include/sheet/obj.js';
        require 'include/sheet/comparator.js';
        require 'include/sheet/getVariable.js';
        require 'include/sheet/time.js';
        require 'include/sheet/callFunction.js';
        require 'include/sheet/getRemoteCell.js';
        require 'include/sheet/getRemoteCellRange.js';
        require 'include/sheet/getRemoteCellValue.js';
        require 'include/sheet/getRemoteCellRangeValue.js';
        require 'include/sheet/getCellRangeValue.js';
        require 'include/sheet/getCellValue.js';
        require 'include/sheet/evaluate.js';
        require 'include/sheet/update.js';
        require 'include/sheet/calculate.js';
        require 'include/sheet/calculateDependency.js';
        require 'include/sheet/calculateDependant.js';
        require 'include/sheet/registerCell.js';
        require 'include/sheet/registerVariable.js';
        require 'include/sheet/getCell.js';
        require 'include/sheet/getCellRange.js';
        require 'include/sheet/applyChange.js';
        require 'include/sheet/scan.js';
        require 'include/sheet/refresh.js';
        require 'include/sheet/reset.js';
        require 'include/sheet/setActiveCell.js';
        require 'include/sheet/getActiveCell.js';
        require 'include/sheet/attachEvent.js';

        /** calx reference */
        require 'include/calx.js';

        /** jQuery Calx */
        require 'include/jQueryCalx.js';
    ?>

})(jQuery, numeral, moment, jStat);