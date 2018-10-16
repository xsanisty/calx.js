/**
 * refresh is similar to update, but instead of scanning for added/removed cells,
 * it's remove whole cell registry and rebuild it
 */
sheet.fx.refresh = function(){
    //console.log('sheet[#'+this.elementId+'] : refreshing the sheet cells registry');
    var cells = this.el.find('[data-cell],[data-formula],[data-format]'),
        sheet = this,
        $cell,
        defaultCellOptions = this.defaultCellOptions;

    this.totalCell = cells.length;
    this.cells = {};

    cells.each(function(){
        var cellAddress = $(this).attr('data-cell');
        var cellOptions = $.extend({element: this, address: cellAddress}, defaultCellOptions, sheet.config.data[cellAddress]);

        $cell = new cell(sheet, cellOptions);
        sheet.registerCell($cell);
    });

    /** rebuild the dependency tree */
    this.buildCellDependency();
};
