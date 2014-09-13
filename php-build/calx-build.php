<?php header('Content-Type', 'text/javascript') ?>

(function($){

    <?php
        require 'include/ieHack.js';
        require 'include/defaultConfig.js';
        require 'include/parserFactory.js';
        require 'include/formula.js';
        require 'include/utility.js';
        require 'include/data.js';

        /** cell reference */
        require 'include/cell.js';
        require 'include/cell/init.js';
        require 'include/cell/calculate.js';
        require 'include/cell/buildDependency.js';
        require 'include/cell/removeDependency.js';
        require 'include/cell/processDependency.js';
        require 'include/cell/registerDependant.js';
        require 'include/cell/removeDependant.js';
        require 'include/cell/processDependant.js';
        require 'include/cell/checkCircularReference.js';
        require 'include/cell/evaluateFormula.js';
        //require 'include/cell/attachEvent.js';
        //require 'include/cell/detachEvent.js';
        require 'include/cell/formTags.js';
        require 'include/cell/setFormat.js';
        require 'include/cell/getFormat.js';

        require 'include/cell/setFormula.js';
        require 'include/cell/getFormula.js';

        require 'include/cell/getAddress.js';
        require 'include/cell/getStringValue.js';
        require 'include/cell/getFormattedValue.js';
        require 'include/cell/getFloatValue.js';

        require 'include/cell/setValue.js';
        require 'include/cell/getValue.js';

        require 'include/cell/setAffected.js';
        require 'include/cell/isAffected.js';

        require 'include/cell/setProcessed.js';
        require 'include/cell/isProcessed.js';

        require 'include/cell/renderComputedValue.js';
        require 'include/cell/resyncValue.js';
        require 'include/cell/resyncFormula.js';


        /** sheet reference */
        require 'include/sheet.js';
        require 'include/sheet/init.js';
        require 'include/sheet/checkCircularReference.js';
        require 'include/sheet/clearProcessedFlag.js';
        require 'include/sheet/buildCellDependency.js';
        //require 'include/sheet/processDependencyTree.js';
        require 'include/sheet/renderComputedValue.js';
        require 'include/sheet/handler.js';
        require 'include/sheet/evaluate.js';
        require 'include/sheet/update.js';
        require 'include/sheet/calculate.js';
        require 'include/sheet/registerCell.js';
        require 'include/sheet/getCell.js';
        require 'include/sheet/getCellRange.js';
        require 'include/sheet/applyChange.js';
        require 'include/sheet/scan.js';
        require 'include/sheet/refresh.js';
        require 'include/sheet/reset.js';
        require 'include/sheet/attachEvent.js';

        /** calx reference */
        require 'include/calx.js';

        /** jQuery Calx */
        require 'include/jQueryCalx.js';
    ?>

})(jQuery);