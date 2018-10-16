sheet.fx.init = function(){
    //console.log('sheet[#'+this.elementId+'] : Initializing the sheet');
    var cells = this.el.find('[data-cell],[data-formula],[data-format]'),
        sheet = this,
        $cell
        defaultCellOptions = this.defaultCellOptions;

    this.totalCell = cells.length;
    this.parser = parserFactory(this);
    this.el.attr('data-calx-identifier', this.identifier);

    /** Register cells based on the found element, and configure if config exists */
    cells.each(function(){
        var cellAddress = $(this).attr('data-cell');
        var cellOptions = $.extend({element: this, address: cellAddress}, defaultCellOptions, sheet.config.data[cellAddress]);

        $cell = new cell(sheet, cellOptions);
        sheet.registerCell($cell);
    });

    /** Register cells based on config */
    for (var cellAddress in this.config.data) {
        if (typeof(this.cells[cellAddress]) == 'undefined'){
            var cellOptions = $.extend({address: cellAddress}, defaultCellOptions, sheet.config.data[cellAddress]);

            $cell = new cell(sheet, cellOptions);
            sheet.registerCell($cell);
        }
    }

    //sheet.buildCellDependency();
    sheet.attachEvent();
};
