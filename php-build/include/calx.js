    /**
     * [calx : the calx core object to work with jquery as plugin]
     * @type {Object}
     */
    var calx = {
        /** sheets collection */
        sheetRegistry : {},
        <?php require 'include/calx/init.js' ?>,
        <?php require 'include/calx/registerFunction.js' ?>,
        <?php require 'include/calx/registerVariable.js' ?>,
        <?php require 'include/calx/refresh.js' ?>,
        <?php require 'include/calx/update.js' ?>,
        <?php require 'include/calx/getSheet.js' ?>,
        <?php require 'include/calx/getCell.js' ?>,
        <?php require 'include/calx/evaluate.js' ?>,
        <?php require 'include/calx/destroy.js' ?>,
        <?php require 'include/calx/calculate.js' ?>

    };